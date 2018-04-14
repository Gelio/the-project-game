import { MessageWithRecipient } from '../MessageWithRecipient';

import { CommunicationServerId, GameMasterId } from '../../common/EntityIds';

export interface PlayerDisconnectedMessagePayload {
  playerId: string;
}

export interface PlayerDisconnectedMessage
  extends MessageWithRecipient<PlayerDisconnectedMessagePayload> {
  type: 'PLAYER_DISCONNECTED';
  senderId: CommunicationServerId;
  recipientId: GameMasterId;
}
