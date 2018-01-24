import { Communicator } from '../common/communicator';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';
import { Service } from '../interfaces/Service';
import { MessageRouter } from './MessageRouter';
import { Player } from './player';

export class GameMaster implements Service {
  private communicator: Communicator;
  private messageRouter: MessageRouter;

  constructor(communicator: Communicator, messageRouter: MessageRouter) {
    this.communicator = communicator;
    this.messageRouter = messageRouter;

    this.handleMessage = this.handleMessage.bind(this);
  }

  public init() {
    this.communicator.bindListeners();
    this.messageRouter.registerGameMasterCommunicator(this.communicator);
    this.communicator.on('message', this.handleMessage);
  }

  public destroy() {
    this.communicator.destroy();
    this.messageRouter.unregisterGameMasterCommunicator();
  }

  private handleMessage<T>(message: MessageWithRecipient<T>) {
    this.messageRouter.sendMessageToPlayer(message);
  }
}
