import { Socket } from 'net';
import { htonl, ntohl } from 'network-byte-order';
import { LoggerInstance } from 'winston';

import { Message } from '../interfaces/Message';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';

import { CustomEventEmitter } from './CustomEventEmitter';

export type FilterFunction<T> = (message: T) => boolean;

export class Communicator extends CustomEventEmitter {
  private readonly socket: Socket;
  private expectedMessageLength: number | null;
  private readonly messageLengthArray = new Uint8Array(Uint32Array.BYTES_PER_ELEMENT);
  private readonly messageLengthBuffer: Buffer;
  private readonly logger: LoggerInstance;

  public get address() {
    return `${this.socket.remoteAddress}:${this.socket.remotePort}`;
  }

  constructor(socket: Socket, logger: LoggerInstance) {
    super();

    this.socket = socket;
    this.expectedMessageLength = null;
    this.messageLengthBuffer = Buffer.from(this.messageLengthArray.buffer);
    this.logger = logger;

    this.readMessage = this.readMessage.bind(this);
  }

  public bindListeners() {
    this.socket.on('readable', this.readMessage);
    this.socket.on('error', error => {
      this.eventEmitter.emit('error', error);
    });

    this.socket.on('close', () => {
      this.logger.info(`Client ${this.address} disconnected`);

      this.eventEmitter.emit('close');
      this.destroy();
    });
  }

  public destroy() {
    this.eventEmitter.emit('destroy');
    this.eventEmitter.removeAllListeners();
    this.socket.removeAllListeners();

    if (!this.socket.destroyed) {
      this.socket.destroy();
    }
  }

  public sendMessage(message: Message<any>) {
    const serializedMessage = JSON.stringify(message);
    this.logger.silly(`Sending message ${message.type} (${serializedMessage.length})`);

    htonl(this.messageLengthArray, 0, serializedMessage.length);

    try {
      this.socket.write(this.messageLengthBuffer);
      this.socket.write(serializedMessage, 'utf8');

      this.eventEmitter.emit('messageSent', message);
    } catch (error) {
      this.logger.error(
        `Error while trying to write to ${this.socket.localAddress}:${this.socket.localPort}`
      );
      this.logger.debug(JSON.stringify(error));
    }
  }

  public waitForAnyMessage(): Promise<Message<any>> {
    return this.waitForSpecificMessage(() => true);
  }

  public waitForSpecificMessage(
    filterFunction: FilterFunction<Message<any>>
  ): Promise<Message<any>>;
  public waitForSpecificMessage(
    filterFunction: FilterFunction<MessageWithRecipient<any>>
  ): Promise<MessageWithRecipient<any>>;
  public waitForSpecificMessage(filterFunction: FilterFunction<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      const eventEmitter = this.eventEmitter;

      function onMessage(message: Message<any>) {
        if (!filterFunction(message)) {
          return;
        }

        resolve(message);
        unregisterListeners();
      }

      function onError(error: any) {
        reject(error);
        unregisterListeners();
      }

      function unregisterListeners() {
        eventEmitter.removeListener('message', onMessage);
        eventEmitter.removeListener('error', onError);
        eventEmitter.removeListener('close', onError);
        eventEmitter.removeListener('destroy', onError);
      }

      eventEmitter.on('message', onMessage);
      eventEmitter.once('error', onError);
      eventEmitter.once('close', onError);
      eventEmitter.once('destroy', onError);
    });
  }

  private readMessage() {
    if (!this.expectedMessageLength) {
      this.tryReadMessageLength();
    }

    if (!this.expectedMessageLength) {
      return;
    }

    const messageBuffer = this.socket.read(this.expectedMessageLength);
    if (!messageBuffer) {
      return;
    }

    this.expectedMessageLength = null;

    const message = JSON.parse(messageBuffer.toString());
    this.logger.silly(`Received message ${message.type} (${messageBuffer.length})`);
    this.eventEmitter.emit('message', message);

    if (this.socket.readableLength > 0) {
      this.readMessage();
    }
  }

  private tryReadMessageLength() {
    if (this.expectedMessageLength) {
      throw new Error('A message is already expected');
    }

    const buffer: Uint8Array = this.socket.read(Uint32Array.BYTES_PER_ELEMENT);
    if (!buffer) {
      return;
    }

    this.expectedMessageLength = ntohl(buffer, 0);
  }
}
