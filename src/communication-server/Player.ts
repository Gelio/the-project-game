import { LoggerInstance } from 'winston';

import { Communicator } from '../common/communicator';

import { Message } from '../interfaces/Message';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { Service } from '../interfaces/Service';

import { MessageRouter } from './MessageRouter';

export class Player implements Service {
  private _isAccepted = false;
  private _id: number;

  private readonly communicator: Communicator;
  private readonly messageRouter: MessageRouter;
  private readonly logger: LoggerInstance;

  public get isAccepted() {
    return this._isAccepted;
  }

  public get id(): number {
    return this._id;
  }

  constructor(communicator: Communicator, messageRouter: MessageRouter, logger: LoggerInstance) {
    this.communicator = communicator;
    this.messageRouter = messageRouter;
    this.logger = logger;

    this.handleMessage = this.handleMessage.bind(this);
    this.handleMessageSent = this.handleMessageSent.bind(this);
  }

  public init() {
    this.communicator.bindListeners();
    this.communicator.on('message', this.handleMessage);
    this.communicator.on('messageSent', this.handleMessageSent);
  }

  public destroy() {
    this.logger.verbose(`Destroying player ${this.id}`);
    this.communicator.destroy();
    this.messageRouter.unregisterPlayerCommunicator(this.id);
  }

  private handleMessage<T>(message: Message<T>) {
    if (!this.isMessageValid(message)) {
      this.logger.warn(
        `Received message with sender ID ${message.senderId} but player ID is ${this.id}`
      );

      return;
    }

    if (!this._isAccepted) {
      if (message.type === 'PLAYER_HELLO') {
        return this.handlePlayerHelloMessage(<any>message);
      }

      this.logger.warn(
        `Player ${this._id} tried to send other message than PLAYER_HELLO as handshake`
      );

      return;
    }

    this.messageRouter.sendMessageToGameMaster(message);
  }

  private handlePlayerHelloMessage(message: PlayerHelloMessage) {
    this._id = message.payload.temporaryId;
    this.messageRouter.registerPlayerCommunicator(this._id, this.communicator);
    this.messageRouter.sendMessageToGameMaster(message);
  }

  private handleMessageSent<T>(message: Message<T>) {
    if (message.type === 'PLAYER_ACCEPTED') {
      const acceptedMessage: PlayerAcceptedMessage = <any>message;
      this._isAccepted = true;
      this.messageRouter.unregisterPlayerCommunicator(this._id);
      this._id = acceptedMessage.payload.assignedPlayerId;
      this.messageRouter.registerPlayerCommunicator(this._id, this.communicator);

      this.communicator.removeListener('messageSend', this.handleMessageSent);
    } else if (message.type === 'PLAYER_REJECTED') {
      this.messageRouter.unregisterPlayerCommunicator(this._id);
      this.destroy();
    }
  }

  private isMessageValid<T>(message: Message<T>) {
    if (!this.id) {
      return true;
    }

    return this.id === message.senderId;
  }
}
