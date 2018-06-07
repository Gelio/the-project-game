import { GAME_MASTER_ID, PlayerId } from '../../common/EntityIds';

import { PlayerRejectedMessage } from '../../interfaces/messages/PlayerRejectedMessage';

export function getPlayerRejectedMessage(
  recipientId: PlayerId,
  reason: string
): PlayerRejectedMessage {
  return {
    type: 'PLAYER_REJECTED',
    senderId: GAME_MASTER_ID,
    recipientId,
    payload: {
      reason
    }
  };
}
