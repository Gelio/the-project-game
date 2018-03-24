import { REQUEST_TYPE } from '../../common/REQUEST_TYPE';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { Message } from '../../interfaces/Message';

import { Board } from '../models/Board';

import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { handleDeletePieceRequest } from './handleDeletePieceRequest';

export class PlayerMessageHandler {
  private readonly board: Board;
  private readonly playersContainer: PlayersContainer;
  private readonly actionDelays: ActionDelays;

  private readonly handlerMap: { [requestType: string]: Function } = {
    [REQUEST_TYPE.DELETE_PIECE_REQUEST]: handleDeletePieceRequest
    // [REQUEST_TYPE.COMMUNICATION_REQUEST]: handleCommunicationRequest
  };

  constructor(board: Board, playersContainer: PlayersContainer, actionDelays: ActionDelays) {
    this.board = board;
    this.playersContainer = playersContainer;
    this.actionDelays = actionDelays;
  }

  public handleMessage(sender: Player, message: Message<any>): ProcessMessageResult<any> {
    const handler = this.handlerMap[message.type];

    if (!handler) {
      return {
        valid: false,
        reason: `Unknown message type: ${message.type}`
      };
    }

    return handler(this.board, this.playersContainer, this.actionDelays, sender, message);
  }
}
