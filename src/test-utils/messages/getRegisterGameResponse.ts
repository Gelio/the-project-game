import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID } from '../../common/EntityIds';

import { RegisterGameResponse } from '../../interfaces/responses/RegisterGameResponse';

export function getRegisterGameResponse(registered: boolean): RegisterGameResponse {
  return {
    type: 'REGISTER_GAME_RESPONSE',
    senderId: COMMUNICATION_SERVER_ID,
    recipientId: GAME_MASTER_ID,
    payload: {
      registered
    }
  };
}
