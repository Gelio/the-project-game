import { Direction } from '../interfaces/Direction';
import { Point } from './Point';

export function getPositionInDirection(oldPosition: Point, direction: Direction): Point {
  switch (direction) {
    case Direction.Down:
      return new Point(oldPosition.x, oldPosition.y + 1);
    case Direction.Up:
      return new Point(oldPosition.x, oldPosition.y - 1);
    case Direction.Left:
      return new Point(oldPosition.x - 1, oldPosition.y);
    case Direction.Right:
      return new Point(oldPosition.x + 1, oldPosition.y);
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}
