import { Socket } from 'net';
import { htonl, ntohl } from 'network-byte-order';
import { LoggerInstance } from 'winston';

import { Message } from '../interfaces/Message';
import { CustomEventEmitter } from './CustomEventEmitter';

export class Communicator extends CustomEventEmitter {
  private readonly socket: Socket;
  private expectedMessageLength: number | null;
  private readonly messageLengthArray = new Uint8Array(Uint32Array.BYTES_PER_ELEMENT);
  private readonly messageLengthBuffer: Buffer;
  private readonly logger: LoggerInstance;

  constructor(socket: Socket, logger: LoggerInstance) {
    super();

    this.socket = socket;
    this.expectedMessageLength = null;
    this.messageLengthBuffer = new Buffer(this.messageLengthArray.buffer);
    this.logger = logger;

    this.readMessage = this.readMessage.bind(this);
  }

  public bindListeners() {
    this.socket.on('readable', this.readMessage);
    this.socket.on('error', error => {
      this.eventEmitter.emit('error', error);
    });

    this.socket.on('close', () => {
      this.logger.info('Client disconnected');

      this.eventEmitter.emit('close');
      this.destroy();
    });
  }

  public destroy() {
    this.eventEmitter.emit('destroy');
    this.eventEmitter.removeAllListeners();
    this.socket.removeAllListeners();
    this.socket.destroy();
  }

  public sendMessage<T>(message: Message<T>) {
    const serializedMessage = JSON.stringify(message);
    this.logger.debug(`Sending message ${message.type} (${serializedMessage.length})`);

    htonl(this.messageLengthArray, 0, serializedMessage.length);
    this.socket.write(this.messageLengthBuffer);
    this.socket.write(serializedMessage, 'utf8');

    this.eventEmitter.emit('messageSent', message);
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
    this.logger.debug(`Received message ${message.type} (${messageBuffer.length})`);
    this.eventEmitter.emit('message', message);
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
