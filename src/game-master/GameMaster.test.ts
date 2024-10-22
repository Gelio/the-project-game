import { EventEmitter } from 'events';
import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createDelay } from '../common/createDelay';
import { createMockCommunicator } from '../common/createMockCommunicator';

import { GameLogsCsvWriter } from '../common/logging/GameLogsCsvWriter';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';

import { UIController } from './ui/IUIController';

import { GameMaster, GameMasterOptions } from './GameMaster';
import { mapOptionsToGameDefinition } from './mapOptionsToGameDefinition';

import { createLogger } from '../test-utils/createLogger';
import { createMockUiController } from '../test-utils/createMockUiController';
import { resolvePromises } from '../test-utils/resolvePromises';

import { getPlayerAcceptedMessage } from '../test-utils/messages/getPlayerAcceptedMessage';
import { getPlayerDisconnectedMessage } from '../test-utils/messages/getPlayerDisconnectedMessage';
import { getPlayerHelloMessage } from '../test-utils/messages/getPlayerHelloMessage';
import { getPlayerRejectedMessage } from '../test-utils/messages/getPlayerRejectedMessage';
import { getRegisterGameRequest } from '../test-utils/messages/getRegisterGameRequest';
import { getRegisterGameResponse } from '../test-utils/messages/getRegisterGameResponse';
import { getUnregisterGameRequest } from '../test-utils/messages/getUnregisterGameRequest';
import { getUnregisterGameResponse } from '../test-utils/messages/getUnregisterGameResponse';

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

    const registerGameResponse = getRegisterGameResponse(true);

    communicator.waitForSpecificMessage = () => <any>Promise.resolve(registerGameResponse);
  });

  it("should initialize gm's components", async () => {
    await gameMaster.init();

    expect(uiController.init).toHaveBeenCalled();
    expect(gameLogsCsvWriter.init).toHaveBeenCalled();
  });

  describe('when registering the game', () => {
    it('should send REGISTER_GAME_REQUEST', async () => {
      const gameDefinition = mapOptionsToGameDefinition(gameMasterOptions);

      const registerGameRequest = getRegisterGameRequest(gameDefinition);

      await gameMaster.init();

      expect(communicator.sendMessage).toHaveBeenCalledWith(registerGameRequest);
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

    it('should try to register the game again for the number of retries in the config', async () => {
      const registerGameResponse = getRegisterGameResponse(false);

      communicator.waitForSpecificMessage = () => <any>Promise.resolve(registerGameResponse);
      await gameMaster.init();
      await createDelay(180);

      expect(communicator.sendMessage).toHaveBeenCalledTimes(
        gameMasterOptions.registrationTriesLimit
      );
    });
  });

  describe('after game registration', () => {
    beforeEach(async () => {
      await gameMaster.init();
    });

    it('should destroy game master and its services', () => {
      const spy = jest.spyOn(gameMaster, 'destroy');

      communicator.emit('close');

      expect(spy).toHaveBeenCalled();
      expect(communicator.destroy).toHaveBeenCalled();
      expect(uiController.destroy).toHaveBeenCalled();
      expect(gameLogsCsvWriter.destroy).toHaveBeenCalled();

      jest.restoreAllMocks();
    });

    describe('after receiving player hello message', () => {
      it('should send player accepted message when the player can join the game', () => {
        const playerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p1', true, 1);

        communicator.emit('message', playerHelloMessage);

        const playerAcceptedMessage = getPlayerAcceptedMessage(playerHelloMessage.senderId);

        expect(communicator.sendMessage).toHaveBeenLastCalledWith(playerAcceptedMessage);
      });

      it('should send player rejected message when the player cannot join the game', () => {
        const playerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p1', false, 1);

        communicator.emit('message', playerHelloMessage);

        const playerRejectedMessage = getPlayerRejectedMessage(
          playerHelloMessage.senderId,
          'Team does not have a leader'
        );

        expect(communicator.sendMessage).toHaveBeenLastCalledWith(playerRejectedMessage);
      });
    });

    describe('when player disconnects', () => {
      it('should note that the player has disconnected', () => {
        const playerDisconnectedMessage = getPlayerDisconnectedMessage('p1');

        communicator.emit('message', playerDisconnectedMessage);

        expect(logger.info).toHaveBeenCalledWith('Player p1 disconnected');
      });
    });

    it('should start the game when both teams are full', () => {
      const firstPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p1', true, 1);
      const secondPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p2', true, 2);

      communicator.emit('message', firstPlayerHelloMessage);
      communicator.emit('message', secondPlayerHelloMessage);

      expect(logger.info).toHaveBeenCalledWith('Game is starting...');
      expect(logger.info).toHaveBeenCalledWith('Game started');
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

        const gameUnregisteredResponse = getUnregisterGameResponse(true);
        const gameUnregisteredRequest = getUnregisterGameRequest(gameMasterOptions.gameName);

        communicator.waitForSpecificMessage = () => <any>Promise.resolve(gameUnregisteredResponse);

        communicator.emit('message', firstPlayerHelloMessage);
        communicator.emit('message', secondPlayerHelloMessage);
        communicator.emit('message', firstPlayerDisconnectedMessage);
        communicator.emit('message', secondPlayerDisconnectedMessage);

        expect(communicator.sendMessage).toHaveBeenLastCalledWith(gameUnregisteredRequest);
      });

      it('should register the game again when there is another round to be played', async () => {
        const firstPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p11', true, 1);
        const secondPlayerHelloMessage = getPlayerHelloMessage(gameMasterOptions, 'p21', true, 2);
        const firstPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
          firstPlayerHelloMessage.senderId
        );
        const secondPlayerDisconnectedMessage = getPlayerDisconnectedMessage(
          secondPlayerHelloMessage.senderId
        );
        const gameUnregisteredResponse = getUnregisterGameResponse(true);

        communicator.waitForSpecificMessage = () => <any>Promise.resolve(gameUnregisteredResponse);

        communicator.emit('message', firstPlayerHelloMessage);
        communicator.emit('message', secondPlayerHelloMessage);
        communicator.emit('message', firstPlayerDisconnectedMessage);
        communicator.emit('message', secondPlayerDisconnectedMessage);

        await createDelay(0);

        const gameDefinition = mapOptionsToGameDefinition(gameMasterOptions);

        const registerGameRequest = getRegisterGameRequest(gameDefinition);

        expect(communicator.sendMessage).toHaveBeenLastCalledWith(registerGameRequest);
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
          const gameUnregisteredResponse = getUnregisterGameResponse(true);

          communicator.waitForSpecificMessage = () =>
            <any>Promise.resolve(gameUnregisteredResponse);

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
        const gameUnregisteredResponse = getUnregisterGameResponse(true);

        communicator.waitForSpecificMessage = () => <any>Promise.resolve(gameUnregisteredResponse);

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
