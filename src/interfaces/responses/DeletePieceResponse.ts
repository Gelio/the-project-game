import { MessageWithRecipient } from '../MessageWithRecipient';

export interface DeletePieceResponse extends MessageWithRecipient<undefined> {
  type: 'DELETE_PIECE_RESPONSE';
  senderId: -1;
}
