import { Message } from '../Message';

export interface PickUpPieceRequest extends Message<undefined> {
  type: 'PICK_UP_PIECE_REQUEST';
}
