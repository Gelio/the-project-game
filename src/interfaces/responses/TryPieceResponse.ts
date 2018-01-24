import { MessageWithRecipient } from '../MessageWithRecipient';

export interface TryPieceResponse
  extends MessageWithRecipient<{ isSham: boolean; didCompleteGoal: boolean }> {
  type: 'TRY_PIECE_RESPONSE';
  senderId: -1;
}
