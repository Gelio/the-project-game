import { Communicator } from '../common/Communicator';
import { createMockCommunicator } from '../common/createMockCommunicator';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { Message } from '../interfaces/Message';

import { MessageRouter } from './MessageRouter';
import { Player } from './Player';
import { PlayerInfo } from './PlayerInfo';

describe('[CS] Player', () => {
  let playerCommunicator: Communicator;
  let gameMasterCommunicator: Communicator;
  let messageRouter: MessageRouter;
  let player: Player;
  let playerInfo: PlayerInfo;
  const gameName = 'aa';

  beforeEach(() => {
    playerCommunicator = createMockCommunicator();
    gameMasterCommunicator = createMockCommunicator();
    messageRouter = new MessageRouter();
    messageRouter.registerGameMasterCommunicator(gameName, gameMasterCommunicator);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    const logger = loggerFactory.createEmptyLogger();
    playerInfo = {
      gameName,
      id: 'player1',
      isLeader: true,
      teamId: 1
    };
    player = new Player(playerCommunicator, messageRouter, logger, playerInfo);
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
