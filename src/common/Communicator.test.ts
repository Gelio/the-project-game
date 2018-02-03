import { EventEmitter } from 'events';

import { Message } from '../interfaces/Message';
import { Communicator } from './Communicator';
import { LoggerFactory } from './logging/LoggerFactory';

class MockSocket {
  public data: any[] = [];

  public write(data: Buffer | string) {
    this.data.push(data);
  }
}

function createCommunicator(socket: any) {
  const loggerFactory = new LoggerFactory();
  loggerFactory.logLevel = 'error';
  const logger = loggerFactory.createConsoleLogger();

  return new Communicator(<any>socket, logger);
}

function createTestMessage(): Message<any> {
  return {
    payload: { foo: 'bar' },
    senderId: 5,
    type: 'TEST_MESSAGE'
  };
}

function makeReadableEventEmitter(eventEmitter: EventEmitter, message: Message<any>) {
  const stringifiedMessage = JSON.stringify(message);

  const messageLengthBuffer = new Buffer(4);
  // Network order is Big Endian
  messageLengthBuffer.writeUInt32BE(stringifiedMessage.length, 0);

  const messageBuffer = new Buffer(stringifiedMessage);

  (<any>eventEmitter).read = (bytesToRead: number) => {
    if (bytesToRead === 4) {
      return messageLengthBuffer;
    }

    return messageBuffer;
  };
}

describe('Communicator', () => {
  describe('sendMessage', () => {
    let socket: MockSocket;
    let communicator: Communicator;

    beforeEach(() => {
      socket = new MockSocket();
      communicator = createCommunicator(socket);
    });

    it('should send data in 2 chunks', () => {
      const message = createTestMessage();
      communicator.sendMessage(message);

      expect(socket.data.length).toEqual(2);
    });

    it('should first send buffer with message length in network order', () => {
      const message = createTestMessage();
      const serializedMessageLength = JSON.stringify(message).length;
      communicator.sendMessage(message);

      expect(socket.data[0]).toBeInstanceOf(Buffer);

      const buffer: Buffer = socket.data[0];

      // Network order is Big Endian
      const readMessageLength = buffer.readUInt32BE(0);

      expect(readMessageLength).toEqual(serializedMessageLength);
    });

    it('should send serialized message as second call to write', () => {
      const message = createTestMessage();
      communicator.sendMessage(message);

      expect(typeof socket.data[1]).toBe('string');

      const readSerializedMessage = socket.data[1];
      const readMessage = JSON.parse(readSerializedMessage);

      expect(readMessage).toEqual(message);
    });

    it("should emit 'messageSent' event after writing", () => {
      const message = createTestMessage();
      let eventEmitted = false;
      communicator.once('messageSent', () => {
        eventEmitted = true;
      });

      communicator.sendMessage(message);

      expect(eventEmitted).toBe(true);
    });
  });

  describe('(events)', () => {
    let eventEmitter: EventEmitter;

    beforeEach(() => {
      eventEmitter = new EventEmitter();
    });

    afterEach(() => {
      eventEmitter.removeAllListeners();
    });

    describe('close event', () => {
      it('should be emitted when socket closes', () => {
        (<any>eventEmitter).destroy = jest.fn();
        const communicator = createCommunicator(eventEmitter);
        communicator.bindListeners();

        let closed = false;
        communicator.once('close', () => {
          closed = true;
        });

        eventEmitter.emit('close');
        expect(closed).toBe(true);
      });
    });

    describe('error event', () => {
      it('should be emitted on socket errors', () => {
        const communicator = createCommunicator(eventEmitter);
        communicator.bindListeners();

        let emitted = false;
        communicator.once('error', () => {
          emitted = true;
        });

        eventEmitter.emit('error');
        expect(emitted).toBe(true);
      });

      it('should pass error event argument', () => {
        const communicator = createCommunicator(eventEmitter);
        communicator.bindListeners();

        let receivedError: Error;
        communicator.once('error', error => {
          receivedError = error;
        });

        const emittedError = new Error('foo');
        eventEmitter.emit('error', emittedError);
        // @ts-ignore
        expect(receivedError).toBe(emittedError);
      });
    });

    describe('message event', () => {
      it('should be emitted when message is received', () => {
        const message = createTestMessage();
        makeReadableEventEmitter(eventEmitter, message);

        const communicator = createCommunicator(eventEmitter);
        communicator.bindListeners();

        communicator.once('message', (receivedMessage: Message<any>) => {
          expect(receivedMessage).toEqual(message);
        });

        eventEmitter.emit('readable');

        expect.assertions(1);
      });
    });
  });
});
