import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID, PlayerId } from '../../common/EntityIds';

import { PlayerDisconnectedMessage } from '../../interfaces/messages/PlayerDisconnectedMessage';

export function getPlayerDisconnectedMessage(playerId: PlayerId): PlayerDisconnectedMessage {
  return {
    type: 'PLAYER_DISCONNECTED',
    senderId: COMMUNICATION_SERVER_ID,
    recipientId: GAME_MASTER_ID,
    payload: {
      playerId
    }
  };
}
