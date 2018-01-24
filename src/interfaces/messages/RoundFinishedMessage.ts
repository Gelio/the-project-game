import { MessageWithRecipient } from '../MessageWithRecipient';

export interface RoundFinishedMessage extends MessageWithRecipient<{ winTeamId: number }> {
  type: 'ROUND_FINISHED';
  senderId: -1;
}
