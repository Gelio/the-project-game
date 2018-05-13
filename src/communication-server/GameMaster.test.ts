import { Communicator } from '../common/Communicator';
import { createMockCommunicator } from '../common/createMockCommunicator';
import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID } from '../common/EntityIds';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { UnregisterGameRequest } from '../interfaces/requests/UnregisterGameRequest';

import { Game } from './Game';
import { GameMaster } from './GameMaster';
import { MessageRouter } from './MessageRouter';
import { SimpleMessageValidator } from './SimpleMessageValidator';

describe('[CS] GameMaster', () => {
  let communicator: Communicator;
  let messageRouter: MessageRouter;
  let game: Game;
  let gameMaster: GameMaster;
  let messageValidator: SimpleMessageValidator;
  const gameName = 'aa';

  beforeEach(() => {
    communicator = createMockCommunicator();
    messageRouter = new MessageRouter();

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    const logger = loggerFactory.createEmptyLogger();
    game = new Game({
      boardSize: { goalArea: 1, taskArea: 2, x: 3 },
      delays: <any>{},
      description: 'Game description',
      goalLimit: 2,
      name: gameName,
      teamSizes: {
        1: 2,
        2: 5
      }
    });

    messageValidator = jest.fn(() => true);

    gameMaster = new GameMaster(communicator, messageRouter, logger, game, messageValidator);
  });

  afterEach(() => {
    messageRouter.unregisterAll();
    gameMaster.removeAllListeners();
  });

  describe('init', () => {
    it('should register in MessageRouter', () => {
      spyOn(messageRouter, 'registerGameMasterCommunicator');
      gameMaster.init();

      expect(messageRouter.registerGameMasterCommunicator).toHaveBeenCalledWith(
        gameName,
        communicator
      );
    });
  });

  describe('after init', () => {
    beforeEach(() => {
      gameMaster.init();
    });

    describe('onDisconnected', () => {
      it('should destroy the game', () => {
        spyOn(game, 'destroy');

        gameMaster.onDisconnected();

        expect(game.destroy).toHaveBeenCalled();
      });

      it('should emit the "disconnect" event', () => {
        const handler = jest.fn();

        gameMaster.once('disconnect', handler);
        gameMaster.onDisconnected();

        expect(handler).toHaveBeenCalled();
      });
    });

    describe('onGameFinished', () => {
      it('should call finish on the game', () => {
        spyOn(game, 'finish');

        gameMaster.onGameFinished();

        expect(game.finish).toHaveBeenCalled();
      });

      it('should emit the "gameFinish" event', () => {
        const handler = jest.fn();

        gameMaster.once('gameFinish', handler);
        gameMaster.onGameFinished();

        expect(handler).toHaveBeenCalled();
      });
    });

    it('should finish the game upon UNREGISTER_GAME_REQUEST', () => {
      spyOn(gameMaster, 'onGameFinished');

      const request: UnregisterGameRequest = {
        type: 'UNREGISTER_GAME_REQUEST',
        senderId: GAME_MASTER_ID,
        recipientId: COMMUNICATION_SERVER_ID,
        payload: {
          gameName
        }
      };
      communicator.emit('message', request);

      expect(gameMaster.onGameFinished).toHaveBeenCalled();
    });
  });
});
