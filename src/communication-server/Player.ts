import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';

import { Message } from '../interfaces/Message';
import { Service } from '../interfaces/Service';

import { MessageRouter } from './MessageRouter';
import { PlayerInfo } from './PlayerInfo';

export class Player implements Service {
  public readonly info: PlayerInfo;

  private readonly communicator: Communicator;
  private readonly messageRouter: MessageRouter;
  private readonly logger: LoggerInstance;

  public get id() {
    return this.info.id;
  }

  constructor(
    communicator: Communicator,
    messageRouter: MessageRouter,
    logger: LoggerInstance,
    playerInfo: PlayerInfo
  ) {
    this.communicator = communicator;
    this.messageRouter = messageRouter;
    this.logger = logger;
    this.info = playerInfo;

    this.handleMessage = this.handleMessage.bind(this);
  }

  public init() {
    this.messageRouter.registerPlayerCommunicator(this.id, this.communicator);
    this.communicator.on('message', this.handleMessage);
  }

  public destroy() {
    this.logger.verbose(`Destroying player ${this.id}`);

    if (this.messageRouter.hasRegisteredPlayerCommunicator(this.id)) {
      this.messageRouter.unregisterPlayerCommunicator(this.id);
    }
  }

  private handleMessage<T>(message: Message<T>) {
    if (!this.isMessageValid(message)) {
      this.logger.warn(
        `Received message with sender ID ${message.senderId} but player ID is ${this.id}`
      );

      return;
    }

    this.messageRouter.sendMessageToGameMaster(this.info.gameName, message);
  }

  private isMessageValid<T>(message: Message<T>) {
    if (!this.id) {
      return true;
    }

    return this.id === message.senderId;
  }
}
