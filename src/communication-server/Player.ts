import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { CustomEventEmitter } from '../common/CustomEventEmitter';

import { Message } from '../interfaces/Message';

import { MessageRouter } from './MessageRouter';
import { PlayerInfo } from './PlayerInfo';

export class Player extends CustomEventEmitter {
  public readonly communicator: Communicator;
  public readonly info: PlayerInfo;

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
    super();

    this.communicator = communicator;
    this.messageRouter = messageRouter;
    this.logger = logger;
    this.info = playerInfo;

    this.handleMessage = this.handleMessage.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  public init() {
    this.messageRouter.registerPlayerCommunicator(this.id, this.communicator);
    this.communicator.on('message', this.handleMessage);
    this.communicator.once('destroy', this.destroy);
  }

  /**
   * Invoked when the player or the GM that hosts the game disconnects
   */
  public destroy() {
    this.unbindListeners();
    this.logger.verbose(`Destroying player ${this.id} and disconnecting his/her communicator`);

    this.tryUnregisterFromMessageRouter();
    this.communicator.destroy();

    this.emit('destroy');
    this.removeAllListeners();
  }

  public onGameFinished() {
    this.unbindListeners();
    this.logger.verbose(`Destroying player ${this.id} because the game finished`);
    this.tryUnregisterFromMessageRouter();

    this.emit('gameFinish');
    this.removeAllListeners();
  }

  private tryUnregisterFromMessageRouter() {
    if (this.messageRouter.hasRegisteredPlayerCommunicator(this.id)) {
      this.messageRouter.unregisterPlayerCommunicator(this.id);
    }
  }

  private handleMessage(message: Message<any>) {
    if (!this.isMessageValid(message)) {
      this.logger.warn(
        `Received message with sender ID ${message.senderId} but player ID is ${this.id}`
      );

      return;
    }

    this.messageRouter.sendMessageToGameMaster(this.info.gameName, message);
  }

  private isMessageValid(message: Message<any>) {
    return this.id === message.senderId;
  }

  private unbindListeners() {
    this.communicator.removeListener('message', this.handleMessage);
    this.communicator.removeListener('destroy', this.destroy);
  }
}
