import { MessageWithRecipient } from '../MessageWithRecipient';

export interface PickUpPieceResponse extends MessageWithRecipient<undefined> {
  type: 'PICK_UP_PIECE_RESPONSE';
  senderId: -1;
}
