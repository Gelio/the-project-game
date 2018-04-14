import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';

import { DeletePieceRequest } from '../../interfaces/requests/DeletePieceRequest';
import { DeletePieceResponse } from '../../interfaces/responses/DeletePieceResponse';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';
import { MessageHandlerDependencies } from './MessageHandlerDependencies';

export function handleDeletePieceRequest(
  { board, actionDelays }: MessageHandlerDependencies,
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
    senderId: GAME_MASTER_ID
  };

  const responsePromise = createDelay(actionDelays.destroy).then(() => response);

  return {
    valid: true,
    delay: actionDelays.destroy,
    responseMessage: responsePromise
  };
}
