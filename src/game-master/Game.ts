import { LoggerInstance } from 'winston';

import { Player } from './Player';
import { PlayersContainer } from './PlayersContainer';

import { createDelay } from '../common/createDelay';

import { Message } from '../interfaces/Message';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';

import { Board } from './models/Board';

import { ProcessMessageResult } from './ProcessMessageResult';

import { UIController } from './ui/UIController';

export class Game {
  public hasStarted = false;
  public board: Board;
  public playersContainer: PlayersContainer;

  // @ts-ignore
  private readonly logger: LoggerInstance;
  private readonly uiController: UIController;
  private nextPlayerId = 1;

  constructor(
    board: Board,
    logger: LoggerInstance,
    uiController: UIController,
    playersContainer: PlayersContainer
  ) {
    this.board = board;
    this.logger = logger;
    this.uiController = uiController;
    this.playersContainer = playersContainer;
  }

  public getNextPlayerId() {
    return this.nextPlayerId++;
  }

  public processMessage<T, U>(message: Message<T>): ProcessMessageResult<U> {
    const delay = 500;

    const sender = this.playersContainer.getPlayerById(message.senderId);
    if (!sender) {
      return {
        valid: false,
        reason: 'Sender ID is invalid'
      };
    }

    sender.isBusy = true;

    // TODO: actually handle the message
    const response: MessageWithRecipient<U> = {
      type: 'TEST_RESPONSE',
      payload: <any>5,
      recipientId: message.senderId,
      senderId: -1
    };

    const responsePromise = createDelay(delay).then(() => {
      sender.isBusy = false;

      return response;
    });

    return {
      delay,
      responseMessage: responsePromise,
      valid: true
    };
  }

  public start() {
    this.hasStarted = true;
  }

  public stop() {
    this.hasStarted = false;
  }

  public removePlayer(disconnectedPlayer: Player) {
    this.board.removePlayer(disconnectedPlayer);
    this.playersContainer.removePlayer(disconnectedPlayer);
  }

  public addPlayer(player: Player) {
    if (player.position === undefined) this.board.setRandomPlayerPosition(player);
    this.playersContainer.addPlayer(player);
    this.board.addPlayer(player);
    this.updateBoard();
  }

  private updateBoard() {
    this.uiController.updateBoard(this.board);
  }
}
