import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { CustomEventEmitter } from '../common/CustomEventEmitter';
import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID } from '../common/EntityIds';
import { REQUEST_TYPE } from '../common/REQUEST_TYPE';

import { stringifySchemaValidationErrors } from '../common/logging/stringifySchemaValidationErrors';

import { Message } from '../interfaces/Message';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';
import { UnregisterGameResponse } from '../interfaces/responses/UnregisterGameResponse';

import { Game } from './Game';
import { MessageRouter } from './MessageRouter';
import { SimpleMessageValidator } from './SimpleMessageValidator';

export class GameMaster extends CustomEventEmitter {
  public readonly game: Game;
  public readonly communicator: Communicator;

  private readonly messageRouter: MessageRouter;
  private readonly logger: LoggerInstance;
  private readonly messageValidator: SimpleMessageValidator;

  constructor(
    communicator: Communicator,
    messageRouter: MessageRouter,
    logger: LoggerInstance,
    game: Game,
    messageValidator: SimpleMessageValidator
  ) {
    super();

    this.communicator = communicator;
    this.messageRouter = messageRouter;
    this.logger = logger;
    this.game = game;
    this.messageValidator = messageValidator;

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
    if (!this.messageValidator(message)) {
      const gameName = this.game.gameDefinition.name;
      this.logger.warn(`Invalid message received from GM handling game "${gameName}"`);

      this.logger.verbose('Message:');
      this.logger.verbose(JSON.stringify(message));

      const stringifiedErrors = stringifySchemaValidationErrors(this.messageValidator.errors || []);
      this.logger.verbose(stringifiedErrors);

      return;
    }

    if (message.type === REQUEST_TYPE.UNREGISTER_GAME_REQUEST) {
      this.onGameFinished();

      const response: UnregisterGameResponse = {
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
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
