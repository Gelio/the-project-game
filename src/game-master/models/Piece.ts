import { Point } from '../../common/Point';

export class Piece {
  public isSham: boolean;

  /**
   * When the piece is picked up, this is the position of the player
   */
  public position: Point;
  public isPickedUp: boolean;
}
