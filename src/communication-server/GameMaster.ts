import { LoggerInstance } from 'winston';

import { Communicator } from '../common/communicator';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';
import { Service } from '../interfaces/Service';
import { MessageRouter } from './MessageRouter';
import { Player } from './player';

export class GameMaster implements Service {
  private readonly communicator: Communicator;
  private readonly messageRouter: MessageRouter;
  private readonly logger: LoggerInstance;

  constructor(communicator: Communicator, messageRouter: MessageRouter, logger: LoggerInstance) {
    this.communicator = communicator;
    this.messageRouter = messageRouter;
    this.logger = logger;

    this.handleMessage = this.handleMessage.bind(this);
  }

  public init() {
    this.communicator.bindListeners();
    this.messageRouter.registerGameMasterCommunicator(this.communicator);
    this.communicator.on('message', this.handleMessage);
  }

  public destroy() {
    this.logger.verbose('Destroying GM connection');
    this.communicator.destroy();
    this.messageRouter.unregisterGameMasterCommunicator();
  }

  private handleMessage<T>(message: MessageWithRecipient<T>) {
    this.messageRouter.sendMessageToPlayer(message);
  }
}
