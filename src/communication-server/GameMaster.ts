import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { CustomEventEmitter } from '../common/CustomEventEmitter';

import { Message } from '../interfaces/Message';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';
import { UnregisterGameResponse } from '../interfaces/responses/UnregisterGameResponse';

import { Game } from './Game';
import { MessageRouter } from './MessageRouter';

export class GameMaster extends CustomEventEmitter {
  public readonly game: Game;
  public readonly communicator: Communicator;

  private readonly messageRouter: MessageRouter;
  private readonly logger: LoggerInstance;

  constructor(
    communicator: Communicator,
    messageRouter: MessageRouter,
    logger: LoggerInstance,
    game: Game
  ) {
    super();

    this.communicator = communicator;
    this.messageRouter = messageRouter;
    this.logger = logger;
    this.game = game;

    this.handleMessage = this.handleMessage.bind(this);
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  public init() {
    this.messageRouter.registerGameMasterCommunicator(
      this.game.gameDefinition.name,
      this.communicator
    );
    this.communicator.on('message', this.handleMessage);
    this.communicator.once('destroy', this.onDisconnected);
  }

  public onDisconnected() {
    this.unbindListeners();

    const gameName = this.game.gameDefinition.name;
    this.logger.info(`Game Master from game ${gameName} disconnected`);

    this.emit('disconnect');
    this.game.destroy();
  }

  public onGameFinished() {
    this.unbindListeners();

    const gameName = this.game.gameDefinition.name;
    this.logger.info(`Game ${gameName} finished`);

    this.emit('gameFinish');
    this.game.finish();
  }

  public sendMessage(message: Message<any>) {
    this.communicator.sendMessage(message);
  }

  private handleMessage(message: MessageWithRecipient<any>) {
    if (message.type === 'UNREGISTER_GAME_REQUEST') {
      this.onGameFinished();

      const response: UnregisterGameResponse = {
        senderId: -3,
        recipientId: -1,
        type: 'UNREGISTER_GAME_RESPONSE',
        payload: {
          unregistered: true
        }
      };
      this.sendMessage(response);

      return;
    }

    this.messageRouter.sendMessageToPlayer(message);
  }

  private unbindListeners() {
    this.communicator.removeListener('destroy', this.onDisconnected);
    this.communicator.removeListener('message', this.handleMessage);

    this.messageRouter.unregisterGameMasterCommunicator(this.game.gameDefinition.name);
  }
}
