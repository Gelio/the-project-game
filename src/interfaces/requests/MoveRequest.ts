import { Direction } from '../Direction';
import { Message } from '../Message';

export interface MoveRequestPayload {
  direction: Direction;
}

export interface MoveRequest extends Message<MoveRequestPayload> {
  type: 'MOVE_REQUEST';
}
