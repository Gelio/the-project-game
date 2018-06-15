import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID } from '../../common/EntityIds';

import { UnregisterGameResponse } from '../../interfaces/responses/UnregisterGameResponse';

export function getUnregisterGameResponse(unregistered: boolean): UnregisterGameResponse {
  return {
    type: 'UNREGISTER_GAME_RESPONSE',
    senderId: COMMUNICATION_SERVER_ID,
    recipientId: GAME_MASTER_ID,
    payload: {
      unregistered
    }
  };
}
