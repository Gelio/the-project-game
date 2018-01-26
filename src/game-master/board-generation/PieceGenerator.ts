import { Point } from '../../common/Point';
import { BoardSize } from '../../interfaces/BoardSize';
import { Piece } from '../models/Piece';
import { Tile } from '../models/tiles/Tile';

export class PieceGenerator {
  public generatePieces(
    count: number,
    shamChance: number,
    tiles: Tile[][],
    boardSize: BoardSize
  ): Piece[] {
    const minY = boardSize.goalArea + 1;

    const pieces: Piece[] = [];

    for (let i = 0; i < count; i++) {
      let position: Point;
      do {
        position = {
          x: Math.floor(Math.random() * boardSize.x),
          y: minY + Math.floor(Math.random() * boardSize.taskArea)
        };
      } while (tiles[position.x][position.y].piece);

      const piece = new Piece();
      piece.isSham = Math.random() < shamChance;
      piece.position = position;

      pieces.push(piece);
    }

    return pieces;
  }
}
