import { createDelay } from '../../common/createDelay';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { DeletePieceRequest } from '../../interfaces/requests/DeletePieceRequest';
import { DeletePieceResponse } from '../../interfaces/responses/DeletePieceResponse';

import { Board } from '../models/Board';

import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';
import { ProcessMessageResult } from '../ProcessMessageResult';

export function handleDeletePieceRequest(
  board: Board,
  _playersContainer: PlayersContainer,
  actionDelays: ActionDelays,
  sender: Player,
  _deletePieceRequest: DeletePieceRequest
): ProcessMessageResult<DeletePieceResponse> {
  if (!sender.heldPiece) {
    return {
      valid: false,
      reason: 'Player does not hold a piece'
    };
  }

  board.removePiece(sender.heldPiece);
  sender.heldPiece = null;

  const response: DeletePieceResponse = {
    type: 'DELETE_PIECE_RESPONSE',
    payload: undefined,
    recipientId: sender.playerId,
    senderId: -1
  };

  const responsePromise = createDelay(actionDelays.destroy).then(() => response);

  return {
    valid: true,
    delay: actionDelays.destroy,
    responseMessage: responsePromise
  };
}
