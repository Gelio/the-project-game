import { EventEmitter } from 'events';
import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createDelay } from '../common/createDelay';
import { createMockCommunicator } from '../common/createMockCommunicator';
import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID, PlayerId } from '../common/EntityIds';
import { TeamId } from '../common/TeamId';

import { GameLogsCsvWriter } from '../common/logging/GameLogsCsvWriter';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { GameDefinition } from '../interfaces/GameDefinition';

import { UIController } from './ui/IUIController';

import { GameMaster, GameMasterOptions } from './GameMaster';
import { mapOptionsToGameDefinition } from './mapOptionsToGameDefinition';

import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';
import { RegisterGameRequest } from '../interfaces/requests/RegisterGameRequest';
import { UnregisterGameRequest } from '../interfaces/requests/UnregisterGameRequest';
import { RegisterGameResponse } from '../interfaces/responses/RegisterGameResponse';
import { UnregisterGameResponse } from '../interfaces/responses/UnregisterGameResponse';

function createMockUiController(logger: LoggerInstance): UIController {
  return <any>{
    updateBoard: jest.fn(),
    init: jest.fn(),
    destroy: jest.fn(),
    createLogger: () => logger,
    updateGameInfo: jest.fn()
  };
}

function createLogger(): LoggerInstance {
  return <any>{
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
    error: jest.fn()
  };
}

async function resolvePromises() {
  return new Promise(res => process.nextTick(res));
}

function getPlayerHelloMessage(
  gameMasterOptions: GameMasterOptions,
  senderId: string,
  isLeader: boolean,
  teamId: TeamId
): PlayerHelloMessage {
  return {
    type: 'PLAYER_HELLO',
    senderId,
    payload: {
      game: gameMasterOptions.gameName,
      teamId,
      isLeader
    }
  };
}

function getPlayerAcceptedMessage(recipientId: PlayerId): PlayerAcceptedMessage {
  return {
    type: 'PLAYER_ACCEPTED',
    senderId: GAME_MASTER_ID,
    recipientId,
    payload: undefined
  };
}

function getPlayerRejectedMessage(recipientId: PlayerId, reason: string): PlayerRejectedMessage {
  return {
    type: 'PLAYER_REJECTED',
    senderId: GAME_MASTER_ID,
    recipientId,
    payload: {
      reason
    }
  };
}

function getPlayerDisconnectedMessage(playerId: PlayerId): PlayerDisconnectedMessage {
  return {
    type: 'PLAYER_DISCONNECTED',
    senderId: COMMUNICATION_SERVER_ID,
    recipientId: GAME_MASTER_ID,
    payload: {
      playerId
    }
  };
}

function getUnregisterGameRequest(gameName: string): UnregisterGameRequest {
  return {
    type: 'UNREGISTER_GAME_REQUEST',
    senderId: GAME_MASTER_ID,
    recipientId: COMMUNICATION_SERVER_ID,
    payload: {
      gameName
    }
  };
}

function getUnregisterGameResponse(unregistered: boolean): UnregisterGameResponse {
  return {
    type: 'UNREGISTER_GAME_RESPONSE',
    senderId: COMMUNICATION_SERVER_ID,
    recipientId: GAME_MASTER_ID,
    payload: {
      unregistered
    }
  };
}

function getRegisterGameResponse(registered: boolean): RegisterGameResponse {
  return {
    type: 'REGISTER_GAME_RESPONSE',
    senderId: COMMUNICATION_SERVER_ID,
    recipientId: GAME_MASTER_ID,
    payload: {
      registered
    }
  };
}

function getRegisterGameRequest(gameDefinition: GameDefinition): RegisterGameRequest {
  return {
    type: 'REGISTER_GAME_REQUEST',
    senderId: GAME_MASTER_ID,
    payload: {
      game: gameDefinition
    }
  };
}

describe('[GM] GameMaster', () => {
  const boardSize: BoardSize = {
    x: 30,
    goalArea: 50,
    taskArea: 301
  };
  const actionDelays: ActionDelays = {
    communicationAccept: 4000,
    communicationRequest: 4000,
    destroy: 4000,
    discover: 4000,
    move: 4000,
    pick: 4000,
    test: 4000,
    place: 4000
  };

  let gameMasterOptions: GameMasterOptions;
  let gameMaster: GameMaster;
  let uiController: UIController;
  let communicator: Communicator;
  let gameLogsCsvWriter: GameLogsCsvWriter;
  let logger: LoggerInstance;

  beforeEach(() => {
    EventEmitter.defaultMaxListeners = 500;

    communicator = createMockCommunicator();

    logger = createLogger();

    uiController = createMockUiController(logger);

    gameLogsCsvWriter = <any>{
      init: jest.fn(),
      destroy: jest.fn(),
      writeLog: jest.fn(),
      error: jest.fn()
    };

    gameMasterOptions = {
      serverHostname: 'localhost',
      serverPort: 4000,
      gameName: 'test game',
      gameDescription: 'description',
      gamesLimit: 5,
      teamSizes: {
        1: 1,
        2: 1
      },
      pointsLimit: 0,
      boardSize: boardSize,
      shamChance: 0.5,
      generatePiecesInterval: 1500,
      piecesLimit: 5,
      logsDirectory: 'logs',
      actionDelays: actionDelays,
      timeout: 5000,
      registrationTriesLimit: 5,
      registerGameInterval: 0
    };

    gameMaster = new GameMaster(gameMasterOptions, uiController, gameLogsCsvWriter, communicator);

    const registerGameResponse = {
      type: 'REGISTER_GAME_RESPONSE',
      payload: {
        registered: true
      }
    };

    communicator.waitForSpecificMessage = () => <any>Promise.resolve(registerGameResponse);
  });

  describe('init', () => {
    describe('should register the game', () => {
      it('should send REGISTER_GAME_REQUEST', async () => {
        const gameDefinition = mapOptionsToGameDefinition(gameMasterOptions);

        const registerGameMessage = getRegisterGameRequest(gameDefinition);

        await gameMaster.init();

        expect(communicator.sendMessage).toHaveBeenCalledWith(registerGameMessage);
      });
    });

    it("should initiialize gm's components", async () => {
      await gameMaster.init();

      expect(uiController.init).toHaveBeenCalled();
      expect(communicator.bindListeners).toHaveBeenCalled();
      expect(gameLogsCsvWriter.init).toHaveBeenCalled();
    });

    describe('registerGame', () => {
      it('should send REGISTER_GAME_REQUEST', async () => {
        const gameDefinition = mapOptionsToGameDefinition(gameMasterOptions);

        const registerGameMessage = getRegisterGameRequest(gameDefinition);

        await gameMaster.init();

        expect(communicator.sendMessage).toHaveBeenCalledWith(registerGameMessage);
      });

      it('should try to register the game again after given interval if request was rejected', async () => {
        jest.useFakeTimers();
        gameMasterOptions.registerGameInterval = 500;

        const registerGameResponse = getRegisterGameResponse(false);

        communicator.waitForSpecificMessage = () => <any>Promise.resolve(registerGameResponse);
        await gameMaster.init();

        expect(communicator.sendMessage).toHaveBeenCalledTimes(1);

        await resolvePromises();

        jest.advanceTimersByTime(gameMasterOptions.registerGameInterval + 1);

        await resolvePromises();

        expect(communicator.sendMessage).toHaveBeenCalledTimes(2);
        jest.useRealTimers();
      });

      it('should try to register the game again up to 5 times', async () => {
        const registerGameResponse = getRegisterGameResponse(false);

        communicator.waitForSpecificMessage = () => <any>Promise.resolve(registerGameResponse);
        await gameMaster.init();
        await createDelay(180);

        expect(communicator.sendMessage).toHaveBeenCalledTimes(
          gameMasterOptions.registrationTriesLimit
        );
      });
    });
  });

  describe('after game registration', () => {
    beforeEach(() => {
      gameMaster.init();
    });

    describe('handleServerDisconnection', () => {
      it('should destroy game master', () => {
        const spy = jest.spyOn(gameMaster, 'destroy');

        communicator.emit('close');

        expect(spy).toBeCalled();

        jest.restoreAllMocks();
      });
    });

    describe('destroy', () => {
      it('should destroy game master and its services', () => {
        const spy = jest.spyOn(gameMaster, 'destroy');

        communicator.emit('close');

        expect(spy).toBeCalled();
        expect(communicator.destroy).toBeCalled();
        expect(uiController.destroy).toBeCalled();
        expect(gameLogsCsvWriter.destroy).toBeCalled();

        jest.restoreAllMocks();
      });
    });

    describe('handlePlayerHelloMessage', () => {
      it('should send player accepted message', () => {
        const playerHelloMessage: PlayerHelloMessage = getPlayerHelloMessage(
          gameMasterOptions,
          'p1',
          true,
          1
        );

        communicator.emit('message', playerHelloMessage);

        const playerAcceptedMessage = getPlayerAcceptedMessage(playerHelloMessage.senderId);

        expect(communicator.sendMessage).toHaveBeenLastCalledWith(playerAcceptedMessage);
      });

      it('should send player rejected message', () => {
        const playerHelloMessage: PlayerHelloMessage = getPlayerHelloMessage(
          gameMasterOptions,
          'p1',
          false,
          1
        );

        communicator.emit('message', playerHelloMessage);

        const playerRejectedMessage = getPlayerRejectedMessage(
          playerHelloMessage.senderId,
          'Team does not have a leader'
        );

        expect(communicator.sendMessage).toHaveBeenLastCalledWith(playerRejectedMessage);
      });
    });

    describe('handlePlayerDisconnectedMessage', () => {
      it('should note that player disconnected', () => {
        const playerDisconnectedMessage = getPlayerDisconnectedMessage('p1');

        communicator.emit('message', playerDisconnectedMessage);

        expect(logger.info).toHaveBeenCalledWith('Player p1 disconnected');
      });
    });

    describe('tryStartGame', () => {
      it('should start the game when both teams are full', () => {
        const firstPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p1', true, 1);
        const secondPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p2', true, 2);

        communicator.emit('message', firstPlayerHelloMessage);
        communicator.emit('message', secondPlayerHelloMessage);

        expect(logger.info).toHaveBeenCalledWith('Game is starting...');
        expect(logger.info).toHaveBeenCalledWith('Game started');
      });
    });

    describe('ending the game', () => {
      it('should unregister the game', () => {
        const firstPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p11', true, 1);
        const secondPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p21', true, 2);

        const firstPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
          firstPlayerHelloMessage.senderId
        );
        const secondPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
          secondPlayerHelloMessage.senderId
        );

        const gameUnregisteredMessage = getUnregisterGameResponse(true);
        const gameUnregisteredResponse = getUnregisterGameRequest(gameMasterOptions.gameName);

        communicator.waitForSpecificMessage = () => <any>Promise.resolve(gameUnregisteredMessage);

        communicator.emit('message', firstPlayerHelloMessage);
        communicator.emit('message', secondPlayerHelloMessage);
        communicator.emit('message', firstPlayerDisconnectedMessage);
        communicator.emit('message', secondPlayerDisconnectedMessage);

        expect(communicator.sendMessage).toHaveBeenLastCalledWith(gameUnregisteredResponse);
      });

      it('should register the game again', async () => {
        const firstPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p11', true, 1);
        const secondPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p21', true, 2);
        const firstPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
          firstPlayerHelloMessage.senderId
        );
        const secondPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
          secondPlayerHelloMessage.senderId
        );
        const gameUnregisteredMessage = getUnregisterGameResponse(true);

        communicator.waitForSpecificMessage = () => <any>Promise.resolve(gameUnregisteredMessage);

        communicator.emit('message', firstPlayerHelloMessage);
        communicator.emit('message', secondPlayerHelloMessage);
        communicator.emit('message', firstPlayerDisconnectedMessage);
        communicator.emit('message', secondPlayerDisconnectedMessage);

        await createDelay(0);

        const gameDefinition = mapOptionsToGameDefinition(gameMasterOptions);

        const registerGameMessage = getRegisterGameRequest(gameDefinition);

        expect(communicator.sendMessage).toHaveBeenLastCalledWith(registerGameMessage);
      });

      it('should not register the game again after rounds limit is reached', async () => {
        for (let round = 0; round < gameMasterOptions.gamesLimit + 1; ++round) {
          const firstPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p11', true, 1);
          const secondPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p21', true, 2);
          const firstPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
            firstPlayerHelloMessage.senderId
          );
          const secondPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
            secondPlayerHelloMessage.senderId
          );
          const gameUnregisteredMessage = getUnregisterGameResponse(true);

          communicator.waitForSpecificMessage = () => <any>Promise.resolve(gameUnregisteredMessage);

          communicator.emit('message', firstPlayerHelloMessage);
          communicator.emit('message', secondPlayerHelloMessage);
          communicator.emit('message', firstPlayerDisconnectedMessage);
          communicator.emit('message', secondPlayerDisconnectedMessage);

          await createDelay(0);
        }
        expect(logger.info).toHaveBeenCalledWith('Rounds limit reached');
      });

      it('should finish the game', async () => {
        const firstPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p11', true, 1);
        const secondPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p21', true, 2);
        const firstPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
          firstPlayerHelloMessage.senderId
        );
        const secondPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
          secondPlayerHelloMessage.senderId
        );
        const gameUnregisteredMessage = getUnregisterGameResponse(true);

        communicator.waitForSpecificMessage = () => <any>Promise.resolve(gameUnregisteredMessage);

        communicator.emit('message', firstPlayerHelloMessage);
        communicator.emit('message', secondPlayerHelloMessage);
        communicator.emit('message', firstPlayerDisconnectedMessage);
        communicator.emit('message', secondPlayerDisconnectedMessage);

        await createDelay(0);

        expect(logger.info).toHaveBeenCalledWith('Round 1 finished');
      });
    });
  });
});
