import { createDelay } from '../../common/createDelay';
import { DeletePieceRequest } from '../../interfaces/requests/DeletePieceRequest';
import { DeletePieceResponse } from '../../interfaces/responses/DeletePieceResponse';
import { Board } from '../models/Board';
import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';
import { ProcessMessageResult } from '../ProcessMessageResult';

export function handleDeletePieceRequest(
  // TODO: add delays
  board: Board,
  playersContainer: PlayersContainer,
  sender: Player,
  deletePieceRequest: DeletePieceRequest
): ProcessMessageResult<DeletePieceResponse> {
  const response: DeletePieceResponse = {
    type: 'DELETE_PIECE_RESPONSE',
    payload: undefined,
    recipientId: sender.playerId,
    senderId: -1
  };

  const responsePromise: Promise<DeletePieceResponse> = createDelay(500).then(() => {
    sender.isBusy = false;

    return response;
  });

  return {
    valid: true,
    delay: 500,
    responseMessage: responsePromise
  };
}
