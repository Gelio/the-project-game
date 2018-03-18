import { EventEmitter } from 'events';

import { Communicator } from '../common/Communicator';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { Message } from '../interfaces/Message';

import { MessageRouter } from './MessageRouter';
import { Player } from './Player';
import { PlayerInfo } from './PlayerInfo';

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
      id: 1,
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
      senderId: 0,
      type: 'OTHER_MESSAGE'
    };

    playerCommunicator.emit('message', message);
    expect(gameMasterCommunicator.sendMessage).not.toHaveBeenCalled();
  });
});
