import { Player } from '../../Player';
import { Piece } from '../Piece';

export abstract class BaseTile {
  public abstract readonly type: string;

  public x: number;
  public y: number;

  public player: Player | null = null;
  public piece: Piece | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public equals(tile: BaseTile) {
    return this.x === tile.x && this.y === tile.y;
  }
}
