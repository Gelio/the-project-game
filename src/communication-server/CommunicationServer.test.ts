import { createConnection, Socket } from 'net';
import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createDelay } from '../common/createDelay';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { CommunicationServer, CommunicationServerOptions } from './CommunicationServer';

import { MessageRouter } from './MessageRouter';

import { Message } from '../interfaces/Message';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';
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
      maxRounds: 4,
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

  async function createConnectedCommunicator(): Promise<Communicator> {
    const socket = await connectSocketToServer();
    const communicator = new Communicator(socket, logger);
    communicator.bindListeners();

    return communicator;
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
      const communicator = await createConnectedCommunicator();

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
      const gmCommunicator = await createConnectedCommunicator();

      jest.spyOn(messageRouter, 'registerGameMasterCommunicator');
      const registerGameRequest = getRegisterGameRequest();
      gmCommunicator.sendMessage(registerGameRequest);
      const response = await gmCommunicator.waitForAnyMessage();

      expect(messageRouter.registerGameMasterCommunicator).toHaveBeenCalledWith(
        registerGameRequest.payload.name,
        jasmine.any(Object)
      );
      expect(response.type).toEqual('REGISTER_GAME_RESPONSE');
      expect((<RegisterGameResponse>response).payload.registered).toEqual(true);

      gmCommunicator.destroy();
    });

    it('should not register two games with the same name', async () => {
      const gmCommunicators = await Promise.all([
        createConnectedCommunicator(),
        createConnectedCommunicator()
      ]);

      const registerGameRequest = getRegisterGameRequest();
      gmCommunicators[0].sendMessage(registerGameRequest);
      await gmCommunicators[0].waitForAnyMessage();

      gmCommunicators[1].sendMessage(registerGameRequest);
      const response = await gmCommunicators[1].waitForAnyMessage();

      expect(response.type).toEqual('REGISTER_GAME_RESPONSE');
      expect((<RegisterGameResponse>response).payload.registered).toEqual(false);

      gmCommunicators.forEach(communicator => communicator.destroy());
    });

    // tslint:disable-next-line:mocha-no-side-effect-code no-empty
    it.skip('should return empty games list', () => {});

    describe('and game registration', () => {
      it('should pass messages between Player and GM', async () => {
        const gmCommunicator = await createConnectedCommunicator();

        const registerGameRequest = getRegisterGameRequest();
        gmCommunicator.sendMessage(registerGameRequest);
        await gmCommunicator.waitForAnyMessage();

        const playerCommunicator = await createConnectedCommunicator();

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

      it('should not register player when he is rejected', async () => {
        const gmCommunicator = await createConnectedCommunicator();

        const registerGameRequest = getRegisterGameRequest();
        gmCommunicator.sendMessage(registerGameRequest);
        await gmCommunicator.waitForAnyMessage();

        const playerCommunicator = await createConnectedCommunicator();

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
        await gmCommunicator.waitForAnyMessage();

        spyOn(messageRouter, 'registerPlayerCommunicator');

        const playerRejectedMessage: PlayerRejectedMessage = {
          payload: { reason: 'test' },
          type: 'PLAYER_REJECTED',
          senderId: -1,
          recipientId: playerHelloMessage.payload.temporaryId
        };
        gmCommunicator.sendMessage(playerRejectedMessage);

        const receivedPlayerAcceptedMessage = await playerCommunicator.waitForAnyMessage();
        expect(receivedPlayerAcceptedMessage).toEqual(playerRejectedMessage);

        expect(messageRouter.registerPlayerCommunicator).not.toHaveBeenCalled();

        playerCommunicator.destroy();
        gmCommunicator.destroy();
      });

      it('should reject player when the game he/she wants to join does not exist', async () => {
        const playerCommunicator = await createConnectedCommunicator();

        // Exchange messages
        const playerHelloMessage: PlayerHelloMessage = {
          type: 'PLAYER_HELLO',
          senderId: -2,
          payload: {
            teamId: 1,
            isLeader: false,
            temporaryId: 123,
            game: 'does not exist'
          }
        };
        playerCommunicator.sendMessage(playerHelloMessage);

        const response = await playerCommunicator.waitForAnyMessage();

        expect(response.type).toEqual('PLAYER_REJECTED');

        playerCommunicator.destroy();
      });

      it("should notify GM about Player's disconnection", async () => {
        const gmCommunicator = await createConnectedCommunicator();
        const registerGameRequest = getRegisterGameRequest();
        gmCommunicator.sendMessage(registerGameRequest);
        await gmCommunicator.waitForAnyMessage();

        // Join game
        const playerCommunicator = await createConnectedCommunicator();
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
        await gmCommunicator.waitForAnyMessage();

        // Accept player
        const playerAcceptedMessage: PlayerAcceptedMessage = {
          payload: { assignedPlayerId: 2 },
          type: 'PLAYER_ACCEPTED',
          senderId: -1,
          recipientId: playerHelloMessage.payload.temporaryId
        };
        gmCommunicator.sendMessage(playerAcceptedMessage);
        await playerCommunicator.waitForAnyMessage();

        playerCommunicator.destroy();
        const playerDisconnectedMessage = <PlayerDisconnectedMessage>await gmCommunicator.waitForAnyMessage();

        expect(playerDisconnectedMessage.type).toEqual('PLAYER_DISCONNECTED');
        expect(playerDisconnectedMessage.payload.playerId).toEqual(2);

        gmCommunicator.destroy();
      });

      // tslint:disable-next-line:mocha-no-side-effect-code no-empty
      it.skip('should list registered game when requested', () => {});

      // tslint:disable-next-line:mocha-no-side-effect-code no-empty
      it.skip('should return empty games list after GM disconnects', () => {});

      it('should disconnect a player after his GM disconnects', async done => {
        const gmCommunicator = await createConnectedCommunicator();
        const registerGameRequest = getRegisterGameRequest();
        gmCommunicator.sendMessage(registerGameRequest);
        await gmCommunicator.waitForAnyMessage();

        // Join game
        const playerCommunicator = await createConnectedCommunicator();
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
        await gmCommunicator.waitForAnyMessage();

        // Accept player
        const playerAcceptedMessage: PlayerAcceptedMessage = {
          payload: { assignedPlayerId: 2 },
          type: 'PLAYER_ACCEPTED',
          senderId: -1,
          recipientId: playerHelloMessage.payload.temporaryId
        };
        gmCommunicator.sendMessage(playerAcceptedMessage);
        await playerCommunicator.waitForAnyMessage();

        playerCommunicator.once('destroy', () => {
          done();
        });
        gmCommunicator.destroy();
      });
    });
  });
});
