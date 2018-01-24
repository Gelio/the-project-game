import { MessageWithRecipient } from '../MessageWithRecipient';

export interface MoveResponse extends MessageWithRecipient<{ distanceToPiece: number }> {
  type: 'MOVE_RESPONSE';
  senderId: -1;
}
