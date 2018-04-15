import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';

import { PickUpPieceRequest } from '../../interfaces/requests/PickUpPieceRequest';
import { PickUpPieceResponse } from '../../interfaces/responses/PickUpPieceResponse';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

export function handlePickUpPieceRequest(
  { board, actionDelays }: MessageHandlerDependencies,
  sender: Player,
  _pickUpPieceRequest: PickUpPieceRequest
): ProcessMessageResult<PickUpPieceResponse> {
  const playerPosition = sender.position;
  if (!playerPosition) {
    return {
      valid: false,
      reason: 'Invalid player position. Something is wrong with GM'
    };
  }
  if (sender.heldPiece) {
    return {
      valid: false,
      reason: 'Player is holding a piece'
    };
  }

  const piece = board.getTileAtPosition(playerPosition).piece;
  if (!piece) {
    return {
      valid: false,
      reason: 'No piece to pick up'
    };
  }

  piece.isPickedUp = true;
  piece.position = playerPosition;
  sender.heldPiece = piece;
  board.getTileAtPosition(playerPosition).piece = null;

  const response: PickUpPieceResponse = {
    type: 'PICK_UP_PIECE_RESPONSE',
    payload: undefined,
    recipientId: sender.playerId,
    senderId: GAME_MASTER_ID
  };

  const responsePromise = createDelay(actionDelays.pick).then(() => response);

  return {
    valid: true,
    delay: actionDelays.pick,
    responseMessage: responsePromise
  };
}
