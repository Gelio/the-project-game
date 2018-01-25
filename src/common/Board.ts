import { Tile } from '../game-master/models/tiles/Tile';
import { BoardSize } from '../interfaces/BoardSize';

export class Board {
  public readonly size: BoardSize;
  public readonly tiles: Tile[][];

  constructor(size: BoardSize, tiles: Tile[][]) {
    this.size = size;
    this.tiles = tiles;
  }

  public reset() {
    // TODO: implement this
  }
}
