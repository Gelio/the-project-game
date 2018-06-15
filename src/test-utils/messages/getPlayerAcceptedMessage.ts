import { GAME_MASTER_ID, PlayerId } from '../../common/EntityIds';

import { PlayerAcceptedMessage } from '../../interfaces/messages/PlayerAcceptedMessage';

export function getPlayerAcceptedMessage(recipientId: PlayerId): PlayerAcceptedMessage {
  return {
    type: 'PLAYER_ACCEPTED',
    senderId: GAME_MASTER_ID,
    recipientId,
    payload: undefined
  };
}
