import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { CustomEventEmitter } from '../common/CustomEventEmitter';

import { stringifySchemaValidationErrors } from '../common/logging/stringifySchemaValidationErrors';

import { Message } from '../interfaces/Message';

import { MessageRouter } from './MessageRouter';
import { PlayerInfo } from './PlayerInfo';
import { SimpleMessageValidator } from './SimpleMessageValidator';

export class Player extends CustomEventEmitter {
  public readonly communicator: Communicator;
  public readonly info: PlayerInfo;

  private readonly messageRouter: MessageRouter;
  private readonly logger: LoggerInstance;
  private readonly messageValidator: SimpleMessageValidator;

  public get id() {
    return this.info.id;
  }

  constructor(
    communicator: Communicator,
    messageRouter: MessageRouter,
    logger: LoggerInstance,
    playerInfo: PlayerInfo,
    messageValidator: SimpleMessageValidator
  ) {
    super();

    this.communicator = communicator;
    this.messageRouter = messageRouter;
    this.logger = logger;
    this.info = playerInfo;
    this.messageValidator = messageValidator;

    this.handleMessage = this.handleMessage.bind(this);
    this.destroy = this.destroy.bind(this);
    this.onCommunicatorDestroyed = this.onCommunicatorDestroyed.bind(this);
  }

  public init() {
    this.messageRouter.registerPlayerCommunicator(this.id, this.communicator);
    this.communicator.on('message', this.handleMessage);
    this.communicator.once('destroy', this.onCommunicatorDestroyed);
  }

  /**
   * Invoked when the player or the GM that hosts the game disconnects
   */
  public destroy() {
    this.logger.verbose(`Destroying player ${this.id} and disconnecting his/her communicator`);

    /**
     * NOTE: The order is right here, because `onCommunicatorDestroyed` will remove the listener
     * for the `destroy` event. If we kept it, we would call `destroy` on the communicator twice
     */
    this.onCommunicatorDestroyed();
    this.communicator.destroy();
  }

  public onGameFinished() {
    this.unbindListeners();
    this.logger.verbose(`Destroying player ${this.id} because the game finished`);
    this.tryUnregisterFromMessageRouter();

    this.emit('gameFinish');
    this.removeAllListeners();
  }

  private onCommunicatorDestroyed() {
    this.unbindListeners();
    this.tryUnregisterFromMessageRouter();

    this.emit('destroy');
    this.removeAllListeners();
  }

  private tryUnregisterFromMessageRouter() {
    if (this.messageRouter.hasRegisteredPlayerCommunicator(this.id)) {
      this.messageRouter.unregisterPlayerCommunicator(this.id);
    }
  }

  private handleMessage(message: Message<any>) {
    if (!this.messageValidator(message)) {
      this.logger.warn(`Invalid message received from player ${this.id}`);

      this.logger.verbose('Message:');
      this.logger.verbose(JSON.stringify(message));

      const stringifiedErrors = stringifySchemaValidationErrors(this.messageValidator.errors || []);
      this.logger.verbose(stringifiedErrors);

      return;
    }

    if (this.id !== message.senderId) {
      this.logger.warn(
        `Received message with sender ID ${message.senderId} but player ID is ${this.id}`
      );

      return;
    }

    this.messageRouter.sendMessageToGameMaster(this.info.gameName, message);
  }

  private unbindListeners() {
    this.communicator.removeListener('message', this.handleMessage);
    this.communicator.removeListener('destroy', this.onCommunicatorDestroyed);
  }
}
