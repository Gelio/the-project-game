import { EventEmitter } from 'events';

import { Communicator } from '../common/Communicator';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { Message } from '../interfaces/Message';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';

import { MessageRouter } from './MessageRouter';
import { Player } from './Player';

function createMockCommunicator(): Communicator {
  const communicator: Communicator = <any>new EventEmitter();

  communicator.bindListeners = jest.fn();
  communicator.destroy = jest.fn();
  communicator.sendMessage = jest.fn();

  return communicator;
}

describe('[CS] Player', () => {
  let playerCommunicator: Communicator;
  let gameMasterCommunicator: Communicator;
  let messageRouter: MessageRouter;
  let player: Player;

  beforeEach(() => {
    playerCommunicator = createMockCommunicator();
    gameMasterCommunicator = createMockCommunicator();
    messageRouter = new MessageRouter();
    messageRouter.registerGameMasterCommunicator(gameMasterCommunicator);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    const logger = loggerFactory.createConsoleLogger();
    player = new Player(playerCommunicator, messageRouter, logger);
    player.init();
  });

  afterEach(() => {
    messageRouter.unregisterAll();
    (<any>playerCommunicator).removeAllListeners();
    player.destroy();
  });

  describe('while handshaking', () => {
    it('should initially not send any other message than PLAYER_HELLO', () => {
      const message: Message<any> = {
        payload: {},
        senderId: 0,
        type: 'OTHER_MESSAGE'
      };

      playerCommunicator.emit('message', message);

      expect(gameMasterCommunicator.sendMessage).not.toHaveBeenCalled();
    });

    it('should pass PLAYER_HELLO to Game Master', () => {
      const message: PlayerHelloMessage = {
        payload: {
          isLeader: true,
          teamId: 1,
          temporaryId: 123
        },
        senderId: -2,
        type: 'PLAYER_HELLO'
      };

      playerCommunicator.emit('message', message);

      expect(gameMasterCommunicator.sendMessage).toHaveBeenCalledTimes(1);
      expect(gameMasterCommunicator.sendMessage).toHaveBeenCalledWith(message);
    });

    it('should register Player communicator during PLAYER_HELLO', () => {
      sendPlayerHelloMessage(123);

      expect(player.id).toBe(123);
      expect(messageRouter.hasRegisteredPlayerCommunicator(123)).toBe(true);
    });

    it('should destroy Communicator and unregister in MessageRouter on PLAYER_REJECTED', () => {
      sendPlayerHelloMessage(1);

      const message: PlayerRejectedMessage = {
        payload: {
          reason: 'foo'
        },
        recipientId: 1,
        senderId: -1,
        type: 'PLAYER_REJECTED'
      };

      playerCommunicator.emit('messageSent', message);

      expect(playerCommunicator.destroy).toHaveBeenCalledTimes(1);
      expect(messageRouter.hasRegisteredPlayerCommunicator(1)).toBe(false);
      expect(player.isAccepted).toBe(false);
    });

    it('should assign ID and register again in MessageRouter on PLAYER_ACCEPTED', () => {
      sendPlayerHelloMessage(123);
      acceptPlayerWithId(123, 2);

      expect(messageRouter.hasRegisteredPlayerCommunicator(1)).toBe(false);
      expect(messageRouter.hasRegisteredPlayerCommunicator(2)).toBe(true);
      expect(player.id).toBe(2);
      expect(player.isAccepted).toBe(true);
    });

    it('should send messages freely after player is accepted', () => {
      sendPlayerHelloMessage(123);
      acceptPlayerWithId(123, 2);
      const message: Message<any> = {
        payload: {},
        senderId: 2,
        type: 'OTHER_MESSAGE'
      };

      playerCommunicator.emit('message', message);

      expect(gameMasterCommunicator.sendMessage).lastCalledWith(message);
    });
  });

  function sendPlayerHelloMessage(temporaryId: number) {
    const message: PlayerHelloMessage = {
      payload: {
        isLeader: true,
        teamId: 1,
        temporaryId
      },
      senderId: -2,
      type: 'PLAYER_HELLO'
    };

    playerCommunicator.emit('message', message);
  }

  function acceptPlayerWithId(temporaryPlayerId: number, newPlayerId: number) {
    const message: PlayerAcceptedMessage = {
      payload: {
        assignedPlayerId: newPlayerId
      },
      recipientId: temporaryPlayerId,
      senderId: -1,
      type: 'PLAYER_ACCEPTED'
    };

    playerCommunicator.emit('messageSent', message);
  }
});
