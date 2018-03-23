import { Board } from '../models/Board';
import { Piece } from '../models/Piece';

import { arrayShuffle } from '../../common/arrayShuffle';
import { Point } from '../../common/Point';

export function createPieceAtRandomPosition(board: Board, shamChance: number): Piece {
  const minY = board.size.goalArea + 1;
  const maxY = board.size.goalArea + board.size.taskArea;
  const yRange = maxY - minY + 1;

  const emptyPositions: Point[] = [];
  for (let y = 0; y < yRange; ++y) {
    for (let x = 0; x < board.size.x; ++x) {
      const tile = board.tiles[x][y];

      if (!tile.piece || !tile.piece.isPickedUp) {
        emptyPositions.push(new Point(x, y));
      }
    }
  }

  if (emptyPositions.length === 0) {
    throw new Error('No place for next piece to be generated');
  }

  const piece = new Piece();
  piece.isSham = Math.random() < shamChance;
  piece.isPickedUp = false;

  arrayShuffle(emptyPositions);
  const newPiecePosition = <Point>emptyPositions.find(position => {
    const tile = board.getTileAtPosition(position);

    return !tile.piece || !tile.piece.isPickedUp;
  });

  piece.position = newPiecePosition;
  board.addPiece(piece);

  return piece;
}
