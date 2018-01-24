import { Message } from '../Message';

export interface TryPieceRequest extends Message<undefined> {
  type: 'TRY_PIECE_REQUEST';
}
