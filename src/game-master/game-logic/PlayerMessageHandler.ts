import { REQUEST_TYPE } from '../../common/REQUEST_TYPE';

import { Message } from '../../interfaces/Message';

import { Board } from '../models/Board';

import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { handleDeletePieceRequest } from './handleDeletePieceRequest';

export class PlayerMessageHandler {
  private readonly board: Board;
  private readonly playersContainer: PlayersContainer;

  private readonly handlerMap: { [requestType: string]: Function } = {
    [REQUEST_TYPE.DELETE_PIECE_REQUEST]: handleDeletePieceRequest
    // [REQUEST_TYPE.COMMUNICATION_REQUEST]: handleCommunicationRequest
  };

  // TODO: add delays as a parameter
  constructor(board: Board, playersContainer: PlayersContainer) {
    this.board = board;
    this.playersContainer = playersContainer;
  }

  public handleMessage<T, U>(sender: Player, message: Message<T>): ProcessMessageResult<U> {
    const handler = this.handlerMap[message.type];

    if (!handler) {
      return {
        valid: false,
        reason: `Unknown message type: ${message.type}`
      };
    }

    // TODO: add delays as a parameter
    return handler(this.board, this.playersContainer, sender, message);
  }
}
