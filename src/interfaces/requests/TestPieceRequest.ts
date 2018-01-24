import { Message } from '../Message';

export interface TestPieceRequest extends Message<undefined> {
  type: 'TEST_PIECE_REQUEST';
}
