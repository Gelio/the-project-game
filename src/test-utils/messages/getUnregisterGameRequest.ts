import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID } from '../../common/EntityIds';

import { UnregisterGameRequest } from '../../interfaces/requests/UnregisterGameRequest';

export function getUnregisterGameRequest(gameName: string): UnregisterGameRequest {
  return {
    type: 'UNREGISTER_GAME_REQUEST',
    senderId: GAME_MASTER_ID,
    recipientId: COMMUNICATION_SERVER_ID,
    payload: {
      gameName
    }
  };
}
