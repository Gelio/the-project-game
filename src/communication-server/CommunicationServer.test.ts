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
import { RegisterGameRequest } from '../interfaces/requests/RegisterGameRequest';
import { RegisterGameResponse } from '../interfaces/responses/RegisterGameResponse';

function getRegisterGameRequest(): RegisterGameRequest {
  return {
    senderId: -1,
    type: 'REGISTER_GAME_REQUEST',
    payload: {
      teamSizes: {
        1: 5,
        2: 5
      },
      boardSize: {
        goalArea: 20,
        taskArea: 20,
        x: 20
      },
      delays: <any>{},
      description: 'Test',
      goalLimit: 10,
      name: 'aaa'
    }
  };
}

describe('[CS] CommunicationServer', () => {
  const options: CommunicationServerOptions = {
    hostname: 'localhost',
    port: 8543
  };
  let messageRouter: MessageRouter;
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
    messageRouter = new MessageRouter();
    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();

    communicationServer = new CommunicationServer(options, messageRouter, logger);
  });

  afterEach(() => {
    messageRouter.unregisterAll();
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

    it("should log incorrect initial client's messages", async () => {
      const socket = await connectSocketToServer();
      const communicator = new Communicator(socket, logger);
      communicator.bindListeners();

      logger.error = jest.fn();
      const message: Message<any> = {
        type: 'UNKNOWN',
        payload: {},
        senderId: -1
      };

      communicator.sendMessage(message);
      await createDelay(100);
      expect(logger.error).toHaveBeenCalled();

      communicator.destroy();
    });

    it("should register GM's game", async () => {
      const gmSocket = await connectSocketToServer();
      const gmCommunicator = new Communicator(gmSocket, logger);
      gmCommunicator.bindListeners();

      const responsePromise = gmCommunicator.waitForAnyMessage();

      jest.spyOn(messageRouter, 'registerGameMasterCommunicator');
      const registerGameRequest = getRegisterGameRequest();
      gmCommunicator.sendMessage(registerGameRequest);
      const response = await responsePromise;

      expect(messageRouter.registerGameMasterCommunicator).toHaveBeenCalledWith(
        registerGameRequest.payload.name,
        jasmine.any(Object)
      );
      expect(response.type).toEqual('REGISTER_GAME_RESPONSE');
      expect((<RegisterGameResponse>response).payload.registered).toEqual(true);

      gmCommunicator.destroy();
      gmSocket.destroy();
    });

    it('should not register two games with the same name', async () => {
      const gmSockets = await Promise.all([connectSocketToServer(), connectSocketToServer()]);
      const gmCommunicators = gmSockets.map(socket => new Communicator(socket, logger));
      gmCommunicators.forEach(comm => comm.bindListeners());

      const registerGameRequest = getRegisterGameRequest();
      const response1Promise = gmCommunicators[0].waitForAnyMessage();
      gmCommunicators[0].sendMessage(registerGameRequest);
      await response1Promise;

      const response2Promise = gmCommunicators[1].waitForAnyMessage();
      gmCommunicators[1].sendMessage(registerGameRequest);
      const response2 = await response2Promise;

      expect(response2.type).toEqual('REGISTER_GAME_RESPONSE');
      expect((<RegisterGameResponse>response2).payload.registered).toEqual(false);

      gmCommunicators.forEach(comm => comm.destroy());
    });

    // tslint:disable-next-line:mocha-no-side-effect-code no-empty
    it.skip('should return empty games list', () => {});

    describe('and game registration', () => {
      it('should pass messages between Player and GM', async () => {
        const gmSocket = await connectSocketToServer();
        const gmCommunicator = new Communicator(gmSocket, logger);
        gmCommunicator.bindListeners();

        const registerGameResponsePromise = gmCommunicator.waitForAnyMessage();
        const registerGameRequest = getRegisterGameRequest();
        gmCommunicator.sendMessage(registerGameRequest);
        await registerGameResponsePromise;

        const playerSocket = await connectSocketToServer();
        const playerCommunicator = new Communicator(playerSocket, logger);
        playerCommunicator.bindListeners();

        // Exchange messages
        const playerHelloMessage: PlayerHelloMessage = {
          type: 'PLAYER_HELLO',
          senderId: -2,
          payload: {
            teamId: 1,
            isLeader: false,
            temporaryId: 123,
            game: registerGameRequest.payload.name
          }
        };
        playerCommunicator.sendMessage(playerHelloMessage);

        const receivedPlayerHelloMessage = await gmCommunicator.waitForAnyMessage();
        expect(receivedPlayerHelloMessage).toEqual(playerHelloMessage);

        const playerAcceptedMessage: PlayerAcceptedMessage = {
          payload: { assignedPlayerId: 2 },
          type: 'PLAYER_ACCEPTED',
          senderId: -1,
          recipientId: playerHelloMessage.payload.temporaryId
        };
        gmCommunicator.sendMessage(playerAcceptedMessage);

        const receivedPlayerAcceptedMessage = await playerCommunicator.waitForAnyMessage();
        expect(receivedPlayerAcceptedMessage).toEqual(playerAcceptedMessage);

        playerCommunicator.destroy();
        gmCommunicator.destroy();
      });

      // tslint:disable-next-line:mocha-no-side-effect-code no-empty
      it.skip('should not register player when he is rejected', () => {});

      // tslint:disable-next-line:mocha-no-side-effect-code no-empty
      it.skip("should notify GM about Player's disconnection", () => {});

      // tslint:disable-next-line:mocha-no-side-effect-code no-empty
      it.skip('should list registered game when requested', () => {});

      // tslint:disable-next-line:mocha-no-side-effect-code no-empty
      it.skip('should return empty games list after GM disconnects', () => {});

      // tslint:disable-next-line:mocha-no-side-effect-code no-empty
      it.skip('should disconnect a player after his GM disconnects', () => {});
    });
  });
});
