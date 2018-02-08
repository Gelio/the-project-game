import { createConnection, Socket } from 'net';
import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createDelay } from '../common/createDelay';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { CommunicationServer, CommunicationServerOptions } from './CommunicationServer';

import { MessageRouter } from './MessageRouter';

import { Message } from '../interfaces/Message';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';

describe('[CS] CommunicationServer', () => {
  const options: CommunicationServerOptions = {
    hostname: 'localhost',
    port: 8543
  };
  let communicationServer: CommunicationServer;
  let logger: LoggerInstance;

  function connectSocketToServer(): Promise<Socket> {
    return new Promise(resolve => {
      const socket = createConnection(
        {
          host: options.hostname,
          port: options.port
        },
        () => resolve(socket)
      );
    });
  }

  beforeEach(() => {
    const messageRouter = new MessageRouter();
    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createConsoleLogger();

    communicationServer = new CommunicationServer(options, messageRouter, logger);
  });

  it('should initialize and destroy correctly', async () => {
    expect(await communicationServer.init()).toBe(true);
    expect(await communicationServer.destroy()).toBe(true);
  });

  it('should handle restarting with init/destroy', async () => {
    await communicationServer.init();
    await communicationServer.destroy();

    await communicationServer.init();
    await communicationServer.destroy();
  });

  describe('after initialization', () => {
    beforeEach(async () => {
      await communicationServer.init();
    });

    afterEach(async () => {
      await communicationServer.destroy();
    });

    it('should handle incoming connection', async () => {
      const socket = await connectSocketToServer();
      expect(socket).toBeInstanceOf(Socket);

      socket.destroy();
    });

    it('should handle multiple incoming connections', async () => {
      const clientCount = 4;

      const sockets: Socket[] = [];
      for (let i = 0; i < clientCount; i++) {
        sockets.push(await connectSocketToServer());
      }

      // Delay so the last client may be initialized properly
      await createDelay(100);

      expect(sockets).toHaveLength(clientCount);
      sockets.forEach(socket => expect(socket).toBeInstanceOf(Socket));

      sockets.forEach(socket => socket.destroy());
    });

    it('should pass messages from Player to GM', async done => {
      const gmSocket = await connectSocketToServer();
      const gmCommunicator = new Communicator(gmSocket, logger);
      gmCommunicator.bindListeners();

      const playerSocket = await connectSocketToServer();
      const playerCommunicator = new Communicator(playerSocket, logger);
      playerCommunicator.bindListeners();

      const playerHelloMessage: PlayerHelloMessage = {
        type: 'PLAYER_HELLO',
        senderId: -2,
        payload: {
          teamId: 1,
          isLeader: false,
          temporaryId: 123
        }
      };

      playerCommunicator.sendMessage(playerHelloMessage);
      gmCommunicator.once('message', (message: Message<any>) => {
        expect(message).toEqual(playerHelloMessage);
        done();
      });
    });

    it('should pass messages from GM to Player', async done => {
      const gmSocket = await connectSocketToServer();
      const gmCommunicator = new Communicator(gmSocket, logger);
      gmCommunicator.bindListeners();

      const playerSocket = await connectSocketToServer();
      const playerCommunicator = new Communicator(playerSocket, logger);
      playerCommunicator.bindListeners();

      const playerHelloMessage: PlayerHelloMessage = {
        type: 'PLAYER_HELLO',
        senderId: -2,
        payload: {
          teamId: 1,
          isLeader: false,
          temporaryId: 123
        }
      };

      playerCommunicator.sendMessage(playerHelloMessage);
      await new Promise(resolve => {
        gmCommunicator.once('message', (message: Message<any>) => {
          expect(message).toEqual(playerHelloMessage);
          resolve();
        });
      });

      const playerAcceptedMessage: PlayerAcceptedMessage = {
        type: 'PLAYER_ACCEPTED',
        senderId: -1,
        recipientId: 123,
        payload: {
          assignedPlayerId: 5
        }
      };
      gmCommunicator.sendMessage(playerAcceptedMessage);

      playerCommunicator.once('message', (message: Message<any>) => {
        expect(message).toEqual(playerAcceptedMessage);
        done();
      });
    });
  });
});
