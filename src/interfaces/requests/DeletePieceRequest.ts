import { Message } from '../Message';

export interface DeletePieceRequest extends Message<undefined> {
  type: 'DELETE_PIECE_REQUEST';
}
