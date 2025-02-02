import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createMockCommunicator } from '../common/createMockCommunicator';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { Message } from '../interfaces/Message';

import { MessageRouter } from './MessageRouter';
import { Player } from './Player';
import { PlayerInfo } from './PlayerInfo';
import { SimpleMessageValidator } from './SimpleMessageValidator';

describe('[CS] Player', () => {
  let playerCommunicator: Communicator;
  let gameMasterCommunicator: Communicator;
  let messageRouter: MessageRouter;
  let player: Player;
  let playerInfo: PlayerInfo;
  let messageValidator: SimpleMessageValidator;
  let logger: LoggerInstance;
  const gameName = 'aa';

  beforeEach(() => {
    playerCommunicator = createMockCommunicator();
    gameMasterCommunicator = createMockCommunicator();
    messageRouter = new MessageRouter();
    messageRouter.registerGameMasterCommunicator(gameName, gameMasterCommunicator);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    messageValidator = jest.fn(() => true);
    messageValidator.errors = [];

    logger = loggerFactory.createEmptyLogger();
    playerInfo = {
      gameName,
      id: 'player1',
      isLeader: true,
      teamId: 1
    };
    player = new Player(playerCommunicator, messageRouter, logger, playerInfo, messageValidator);
    player.init();
  });

  afterEach(() => {
    messageRouter.unregisterAll();
    playerCommunicator.removeAllListeners();
    player.destroy();
  });

  it('should send messages freely to GM', () => {
    const message: Message<any> = {
      payload: {},
      senderId: player.id,
      type: 'OTHER_MESSAGE'
    };

    playerCommunicator.emit('message', message);

    expect(gameMasterCommunicator.sendMessage).toHaveBeenLastCalledWith(message);
  });

  it('should not send message when player ID is missing', () => {
    const message = {
      payload: {},
      senderId: 'uuid',
      type: 'OTHER_MESSAGE'
    };

    playerCommunicator.emit('message', message);
    expect(gameMasterCommunicator.sendMessage).not.toHaveBeenCalled();
  });

  it('should validate incoming messages', () => {
    const message = {};
    playerCommunicator.emit('message', message);

    expect(messageValidator).toHaveBeenCalledWith(message);
  });

  it('should log a warning when the incoming message is invalid', () => {
    (<jest.Mock>messageValidator).mockImplementation(() => false);
    spyOn(logger, 'warn');

    playerCommunicator.emit('message', {});

    expect(logger.warn).toHaveBeenCalled();
  });

  describe('destroy', () => {
    it('should unregister the player from MessageRouter', () => {
      jest.spyOn(messageRouter, 'unregisterPlayerCommunicator');

      player.destroy();
      expect(messageRouter.unregisterPlayerCommunicator).toHaveBeenCalledWith(player.id);
    });

    it('should emit the "destroy" event', () => {
      const handler = jest.fn();
      player.once('destroy', handler);

      player.destroy();

      expect(handler).toHaveBeenCalled();
    });

    it('should destroy the communicator', () => {
      player.destroy();

      expect(playerCommunicator.destroy).toHaveBeenCalled();
    });
  });

  describe('onGameFinished', () => {
    it('should unregister the player from MessageRouter', () => {
      jest.spyOn(messageRouter, 'unregisterPlayerCommunicator');

      player.onGameFinished();
      expect(messageRouter.unregisterPlayerCommunicator).toHaveBeenCalledWith(player.id);
    });

    it('should emit the "gameFinish" event', () => {
      const handler = jest.fn();
      player.once('gameFinish', handler);

      player.onGameFinished();

      expect(handler).toHaveBeenCalled();
    });
  });
});
