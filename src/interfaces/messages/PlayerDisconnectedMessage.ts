import { MessageWithRecipient } from '../MessageWithRecipient';

export interface PlayerDisconnectedMessage extends MessageWithRecipient<{ playerId: number }> {
  type: 'PLAYER_DISCONNECTED';
  senderId: -3;
  recipientId: -1;
}
