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

    const gameName = this.game.gameDefinition.name;
    if (this.messageRouter.hasRegisteredGameMasterCommunicator(gameName)) {
      this.messageRouter.unregisterGameMasterCommunicator(gameName);
    }

    this.communicator.removeListener('message', this.handleMessage);
    this.game.destroy();
  }

  public sendMessage(message: Message<any>) {
    this.communicator.sendMessage(message);
  }

  private handleMessage<T>(message: MessageWithRecipient<T>) {
    // TODO: check if it is the game finishing message. If so, destroy the game master
    // (after making sure all the players got the message). Probably a new message has to be
    // introduced (passed between CS and GM)
    this.messageRouter.sendMessageToPlayer(message);
  }
}
