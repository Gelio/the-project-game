import * as Stream from 'stream';

import { Message } from '../interfaces/Message';

import { Communicator } from './Communicator';
import { createDelay } from './createDelay';

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
    senderId: 'hello',
    type: 'TEST_MESSAGE'
  };
}

function serializeMessage(message: Message<any>) {
  const stringifiedMessage = JSON.stringify(message);

  const buffer = Buffer.alloc(stringifiedMessage.length + 4);
  // Network order is Big Endian
  buffer.writeUInt32BE(stringifiedMessage.length, 0);

  buffer.write(stringifiedMessage, 4);

  return buffer;
}

function writeMessageToStream(stream: Stream.Writable, message: Message<any>) {
  const messageBuffer = serializeMessage(message);
  stream.write(messageBuffer);
}

describe('Communicator', () => {
  describe('sendMessage', () => {
    let socket: MockSocket;
    let communicator: Communicator;

    beforeEach(() => {
      socket = new MockSocket();
      communicator = createCommunicator(socket);
    });

    afterEach(() => {
      communicator.removeAllListeners();
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

    it('should ignore any errors when writing the data to the socket', () => {
      /**
       * NOTE: this test simulates writing to a closed socket
       * For instance, when the client disconnects before the message is sent.
       */

      socket.write = () => {
        throw new Error('Error while writing');
      };

      const message = createTestMessage();

      expect(() => communicator.sendMessage(message)).not.toThrow();
    });
  });

  describe('waitForAnyMessage', () => {
    let socket: Stream.PassThrough;
    let communicator: Communicator;

    beforeEach(() => {
      socket = new Stream.PassThrough();
      communicator = createCommunicator(socket);
    });

    afterEach(() => {
      socket.removeAllListeners();
      communicator.removeAllListeners();
    });

    it('should resolve with a message', () => {
      const message = createTestMessage();
      const promise = communicator.waitForAnyMessage();

      communicator.bindListeners();
      writeMessageToStream(socket, message);

      expect(promise).resolves.toEqual(message);
    });

    it('should reject with an error when socket errors', () => {
      const promise = communicator.waitForAnyMessage();

      communicator.bindListeners();
      socket.emit('error', 'a');

      expect(promise).rejects.toEqual('a');
    });

    it('should reject when socket is destroyed', () => {
      const promise = communicator.waitForAnyMessage();

      communicator.bindListeners();
      socket.emit('destroy', 'a');

      expect(promise).rejects.toEqual('a');
    });
  });

  describe('waitForSpecificMessage', () => {
    let socket: Stream.PassThrough;
    let communicator: Communicator;

    beforeEach(() => {
      socket = new Stream.PassThrough();
      communicator = createCommunicator(socket);
    });

    it('should resolve with a message when it matches the filter function', () => {
      const message = createTestMessage();
      const message2 = createTestMessage();
      message2.type = 'TEST2';

      const promise = communicator.waitForSpecificMessage(msg => msg.type === 'TEST2');

      communicator.bindListeners();
      writeMessageToStream(socket, message);
      writeMessageToStream(socket, message2);

      expect(promise).resolves.toEqual(message2);
    });

    it('should call the filter function for each message until a match', async () => {
      const message = createTestMessage();
      const message2 = createTestMessage();
      message2.type = 'TEST2';

      const filterFunction = jest.fn(msg => msg.type === 'TEST2');
      const promise = communicator.waitForSpecificMessage(filterFunction);

      communicator.bindListeners();
      writeMessageToStream(socket, message);
      writeMessageToStream(socket, message2);

      expect(await promise).toEqual(message2);
      expect(filterFunction).toHaveBeenCalledTimes(2);
    });

    it('should not call the filter function after a match', async () => {
      const message = createTestMessage();
      const message2 = createTestMessage();
      message2.type = 'TEST2';

      const filterFunction = jest.fn(msg => msg.type === message.type);
      const promise = communicator.waitForSpecificMessage(filterFunction);

      communicator.bindListeners();
      writeMessageToStream(socket, message);
      writeMessageToStream(socket, message2);

      expect(await promise).toEqual(message);
      expect(filterFunction).toHaveBeenCalledTimes(1);
    });

    it('should reject with an error when socket errors', () => {
      const promise = communicator.waitForSpecificMessage(() => true);

      communicator.bindListeners();
      socket.emit('error', 'a');

      expect(promise).rejects.toEqual('a');
    });

    it('should reject when socket is destroyed', () => {
      const promise = communicator.waitForSpecificMessage(() => true);

      communicator.bindListeners();
      socket.emit('destroy', 'a');

      expect(promise).rejects.toEqual('a');
    });
  });

  describe('(events)', () => {
    let socket: Stream.PassThrough;

    beforeEach(() => {
      socket = new Stream.PassThrough();
    });

    afterEach(() => {
      socket.removeAllListeners();
    });

    describe('close event', () => {
      it('should be emitted when socket closes', () => {
        const communicator = createCommunicator(socket);
        communicator.bindListeners();

        let closed = false;
        communicator.once('close', () => {
          closed = true;
        });

        socket.emit('close');
        expect(closed).toBe(true);
      });
    });

    describe('error event', () => {
      it('should be emitted on socket errors', () => {
        const communicator = createCommunicator(socket);
        communicator.bindListeners();

        let emitted = false;
        communicator.once('error', () => {
          emitted = true;
        });

        socket.emit('error');
        expect(emitted).toBe(true);
      });

      it('should pass error event argument', () => {
        const communicator = createCommunicator(socket);
        communicator.bindListeners();

        let receivedError: Error;
        communicator.once('error', error => {
          receivedError = error;
        });

        const emittedError = new Error('foo');
        socket.emit('error', emittedError);
        // @ts-ignore
        expect(receivedError).toBe(emittedError);
      });
    });

    describe('message event', () => {
      it('should be emitted when message is received', async () => {
        const message = createTestMessage();

        const communicator = createCommunicator(socket);
        communicator.bindListeners();

        communicator.once('message', (receivedMessage: Message<any>) => {
          expect(receivedMessage).toEqual(message);
        });

        writeMessageToStream(socket, message);

        await createDelay(50);

        expect.assertions(1);
      });

      it('should be emitted when multiple messages arrived in a single TCP packet', async () => {
        const message = createTestMessage();
        const serializedMessage = serializeMessage(message);
        const repeatedMessages = Buffer.alloc(serializedMessage.length * 2);
        serializedMessage.copy(repeatedMessages, 0);
        serializedMessage.copy(repeatedMessages, serializedMessage.length);

        const communicator = createCommunicator(socket);
        communicator.bindListeners();

        const handler = jest.fn();
        communicator.on('message', handler);

        socket.write(repeatedMessages);

        await createDelay(50);

        expect(handler).toHaveBeenCalledTimes(2);
        expect(handler).toHaveBeenCalledWith(message);

        communicator.removeAllListeners();
      });
    });
  });
});
