import { Message } from '../Message';

export interface PlaceDownPieceRequest extends Message<undefined> {
  type: 'PLACE_DOWN_PIECE_REQUEST';
}
