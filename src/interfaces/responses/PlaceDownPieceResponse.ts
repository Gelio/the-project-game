import { MessageWithRecipient } from '../MessageWithRecipient';

export interface PlaceDownPieceResponse extends MessageWithRecipient<undefined> {
  type: 'PLACE_DOWN_PIECE_RESPONSE';
  senderId: -1;
}
