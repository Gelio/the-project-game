import { Direction } from '../Direction';
import { Message } from '../Message';

export interface MoveRequest extends Message<{ direction: Direction }> {
  type: 'MOVE_REQUEST';
}
