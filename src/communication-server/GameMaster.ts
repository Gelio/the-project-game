import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { Message } from '../interfaces/Message';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';
import { Service } from '../interfaces/Service';

import { Game } from './Game';
import { MessageRouter } from './MessageRouter';

export class GameMaster implements Service {
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
    this.communicator = communicator;
    this.messageRouter = messageRouter;
    this.logger = logger;
    this.game = game;

    this.handleMessage = this.handleMessage.bind(this);
  }

  public init() {
    this.messageRouter.registerGameMasterCommunicator(
      this.game.gameDefinition.name,
      this.communicator
    );
    this.communicator.on('message', this.handleMessage);
  }

  public destroy() {
    this.logger.verbose('Destroying GM connection');
    this.messageRouter.unregisterGameMasterCommunicator(this.game.gameDefinition.name);
    this.game.destroy();
    this.communicator.destroy();
  }

  public sendMessage(message: Message<any>) {
    this.communicator.sendMessage(message);
  }

  private handleMessage<T>(message: MessageWithRecipient<T>) {
    this.messageRouter.sendMessageToPlayer(message);
  }
}
