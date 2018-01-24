import { Player } from './Player';

import { Board } from '../common/Board';
import { Message } from '../interfaces/Message';
import { ProcessMessageResult, ValidMessageResult } from './ProcessMessageResult';
import { createDelay } from '../common/createDelay';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';

export class Game {
  private nextPlayerId = 1;
  private players: Player[] = [];
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  public getNextPlayerId() {
    return this.nextPlayerId++;
  }

  public addPlayer(player: Player) {
    if (this.players.indexOf(player) !== -1) {
      throw new Error('Player already added');
    }

    // TODO: add player on board

    this.players.push(player);
  }

  public removePlayer(player: Player) {
    const playerIndex = this.players.indexOf(player);
    if (playerIndex === -1) {
      throw new Error('Player is not added');
    }

    // TODO: remove player from board

    this.players.splice(playerIndex, 1);
  }

  public processMessage<T, U>(message: Message<T>): ProcessMessageResult<U> {
    const delay = 500;

    // TODO: mark player as busy if action is valid

    const response: MessageWithRecipient<U> = {
      type: 'TEST_RESPONSE',
      payload: <any>5,
      recipientId: message.senderId,
      senderId: -1
    };

    return {
      delay,
      responseMessage: createDelay(delay).then(() => response),
      valid: true
    };
  }
}
