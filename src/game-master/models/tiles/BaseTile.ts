import { Player } from '../../Player';
import { Piece } from '../Piece';

export abstract class BaseTile {
  public readonly type: string;

  public x: number;
  public y: number;

  public player: Player | null = null;
  public piece: Piece | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
