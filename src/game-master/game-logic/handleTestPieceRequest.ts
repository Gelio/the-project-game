import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';

import { TestPieceRequest } from '../../interfaces/requests/TestPieceRequest';
import { TestPieceResponse } from '../../interfaces/responses/TestPieceResponse';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

export function handleTestPieceRequest(
  { actionDelays }: MessageHandlerDependencies,
  sender: Player,
  _testPieceRequest: TestPieceRequest
): ProcessMessageResult<TestPieceResponse> {
  if (!sender.heldPiece) {
    return {
      valid: false,
      reason: 'Player does not hold a piece'
    };
  }

  const response: TestPieceResponse = {
    type: 'TEST_PIECE_RESPONSE',
    payload: { isSham: sender.heldPiece.isSham },
    recipientId: sender.playerId,
    senderId: GAME_MASTER_ID
  };

  const responsePromise = createDelay(actionDelays.test).then(() => response);

  return {
    valid: true,
    delay: actionDelays.test,
    responseMessage: responsePromise
  };
}
