import { createDelay } from '../../common/createDelay';

import { DiscoveryRequest } from '../../interfaces/requests/DiscoveryRequest';
import { DiscoveryResponse } from '../../interfaces/responses/DiscoveryResponse';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';
import { MessageHandlerDependencies } from './MessageHandlerDependencies';

export function handleDiscoveryRequest(
  { board, actionDelays }: MessageHandlerDependencies,
  sender: Player,
  _deletePieceRequest: DiscoveryRequest
): ProcessMessageResult<DiscoveryResponse> {
  if (!sender.position) {
    return {
      valid: false,
      reason: 'Invalid player position. Something is wrong with GM'
    };
  }

  const playerPosition = sender.position;
  // const fromX = Math.min(playerPosition.)

  const response: DiscoveryResponse = {
    type: 'DELETE_PIECE_RESPONSE',
    payload: undefined,
    recipientId: sender.playerId,
    senderId: -1
  };

  const responsePromise = createDelay(actionDelays.destroy).then(() => response);

  return {
    valid: true,
    delay: actionDelays.discover,
    responseMessage: responsePromise
  };
}
