import { BoardSize } from '../interfaces/BoardSize';

export class Board {
  public readonly size: BoardSize;

  constructor(size: BoardSize) {
    this.size = size;
  }

  public reset() {
    // TODO: implement this
  }
}
