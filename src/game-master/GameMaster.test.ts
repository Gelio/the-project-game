import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createMockCommunicator } from '../common/createMockCommunicator';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';

import { UIController } from './ui/IUIController';

import { GameMaster, GameMasterOptions } from './GameMaster';
import { GAME_MASTER_ID, PlayerId, COMMUNICATION_SERVER_ID } from '../common/EntityIds';
import { mapOptionsToGameDefinition } from './mapOptionsToGameDefinition';
import { GameLogsCsvWriter } from '../common/logging/GameLogsCsvWriter';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { TeamId } from '../common/TeamId';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { UnregisterGameRequest } from '../interfaces/requests/UnregisterGameRequest';
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
  let bool = false;

  return <any>{
    warn: bool ? console.log : jest.fn(),
    info: bool ? console.log : jest.fn(),
    verbose: bool ? console.log : jest.fn(),
    error: bool ? console.log : jest.fn()
  };
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

  const gameMasterOptions: GameMasterOptions = {
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
    registerGameInterval: 300
  };

  let gameMaster: GameMaster;
  let uiController: UIController;
  let communicator: Communicator;
  let connectToServer: Function;
  let gameLogsCsvWriter: GameLogsCsvWriter;
  let logger: LoggerInstance;

  beforeEach(() => {
    communicator = createMockCommunicator();

    logger = createLogger();

    uiController = createMockUiController(logger);

    gameLogsCsvWriter = <any>{
      init: jest.fn(),
      destroy: jest.fn(),
      writeLog: jest.fn(),
      error: jest.fn()
    };

    connectToServer = () => {
      return {
        communicator: communicator,
        connectedPromise: Promise.resolve()
      };
    };

    gameMaster = new GameMaster(
      gameMasterOptions,
      uiController,
      <any>gameLogsCsvWriter,
      connectToServer
    );

    const registeredGameMessage = {
      type: 'REGISTER_GAME_RESPONSE',
      payload: {
        registered: true
      }
    };

    communicator.waitForSpecificMessage = () => <any>Promise.resolve(registeredGameMessage);
  });

  describe('init', () => {
    describe('should register the game', () => {
      it('should send REGISTER_GAME_REQUEST', async () => {
        const gameDefinition = mapOptionsToGameDefinition(gameMasterOptions);

        const registerGameMessage = {
          type: 'REGISTER_GAME_REQUEST',
          senderId: GAME_MASTER_ID,
          payload: {
            game: gameDefinition
          }
        };

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

    describe('registerGame', () => {
      it('should send REGISTER_GAME_REQUEST', async () => {
        const gameDefinition = mapOptionsToGameDefinition(gameMasterOptions);

        const registerGameMessage = {
          type: 'REGISTER_GAME_REQUEST',
          senderId: GAME_MASTER_ID,
          payload: {
            game: gameDefinition
          }
        };

        await gameMaster.init();

        expect(communicator.sendMessage).toHaveBeenCalledWith(registerGameMessage);
      });
    });

    // it.only('should try to register the game again after given interval if request was rejected', async () => {
    //   jest.useFakeTimers();

    //   const registeredGameMessage = {
    //     type: 'REGISTER_GAME_RESPONSE',
    //     payload: {
    //       registered: false
    //     }
    //   };

    //   communicator.waitForSpecificMessage = () => <any>Promise.resolve(registeredGameMessage);
    //   await gameMaster.init();
    //   expect(communicator.sendMessage).toHaveBeenCalledTimes(1);

    //   jest.advanceTimersByTime(gameMasterOptions.registerGameInterval * 2);

    //   expect(communicator.sendMessage).toHaveBeenCalledTimes(2);

    //   jest.useRealTimers();
    // });

    // it('should try to register the game again up to 5 times', async () => {
    //   jest.useFakeTimers();

    //   const registeredGameMessage = {
    //     type: 'REGISTER_GAME_RESPONSE',
    //     payload: {
    //       registered: false
    //     }
    //   };

    //   communicator.waitForSpecificMessage = () => <any>Promise.resolve(registeredGameMessage);
    //   await gameMaster.init();
    //   expect(communicator.sendMessage).toHaveBeenCalledTimes(1);

    //   jest.advanceTimersByTime(gameMasterOptions.registerGameInterval * 10);
    //   expect(communicator.sendMessage).toHaveBeenCalledTimes(5);

    //   jest.useRealTimers();
    // });

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

      // it('should finish the game', async () => {
      //   const firstPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p11', true, 1);
      //   const secondPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p21', true, 2);
      //   const firstPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
      //     firstPlayerHelloMessage.senderId
      //   );
      //   const secondPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
      //     secondPlayerHelloMessage.senderId
      //   );
      //   const gameUnregisteredMessage = getUnregisterGameResponse(gameMasterOptions.gameName, true);
      //   communicator.waitForSpecificMessage = () => <any>Promise.resolve(gameUnregisteredMessage);
      //   communicator.emit('message', firstPlayerHelloMessage);
      //   communicator.emit('message', secondPlayerHelloMessage);
      //   communicator.emit('message', firstPlayerDisconnectedMessage);
      //   communicator.emit('message', secondPlayerDisconnectedMessage);
      //   expect(logger.info).toHaveBeenCalledWith('Round 1 finished');
      // });
    });
  });
});
