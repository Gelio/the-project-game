import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface PlayerRejectedMessagePayload {
  reason: string;
}

export interface PlayerRejectedMessage extends MessageWithRecipient<PlayerRejectedMessagePayload> {
  type: 'PLAYER_REJECTED';
  senderId: GameMasterId;
}
