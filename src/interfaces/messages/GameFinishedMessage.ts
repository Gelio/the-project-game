import { MessageWithRecipient } from '../MessageWithRecipient';

export interface GameFinishedMessage
  extends MessageWithRecipient<{ team1Score: number; team2Score: number }> {
  type: 'GAME_FINISHED';
  senderId: -1;
}
