import { MessageWithRecipient } from '../MessageWithRecipient';

export interface PlayerRejectedMessage extends MessageWithRecipient<{ reason: string }> {
  type: 'PLAYER_REJECTED';
  senderId: -1;
}
