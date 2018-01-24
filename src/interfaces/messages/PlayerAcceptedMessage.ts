import { MessageWithRecipient } from '../MessageWithRecipient';

export interface PlayerAcceptedMessage extends MessageWithRecipient<{ assignedPlayerId: number }> {
  type: 'PLAYER_ACCEPTED';
  senderId: -1;
}
