import { Board } from '../models/Board';
import { Piece } from '../models/Piece';

import { createPieceAtRandomPosition } from './createPieceAtRandomPosition';

import { Point } from '../../common/Point';

describe('[GM] createPieceAtRandomPosition', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(
      {
        goalArea: 5,
        taskArea: 10,
        x: 10
      },
      20
    );
  });

  it('should generate a new piece on the board', () => {
    const piece = createPieceAtRandomPosition(board, 0.5);

    expect(piece).toBeDefined();
  });

  it('should generate a piece that has a correct position set', () => {
    const piece = createPieceAtRandomPosition(board, 0.5);
    const tile = board.getTileAtPosition(piece.position);

    expect(tile.piece).toBe(piece);
  });

  it('should throw an error when there is no room for a new piece on the board', () => {
    board = new Board(
      {
        goalArea: 0,
        taskArea: 1,
        x: 1
      },
      20
    );

    const piece = new Piece();
    board.tiles[0][0].piece = piece;

    expect(() => createPieceAtRandomPosition(board, 0.5)).toThrow();
  });

  it('should generate a piece that is not picked up', () => {
    const piece = createPieceAtRandomPosition(board, 1);

    expect(piece.isPickedUp).toBe(false);
  });

  it('should generate a sham when sham chance is high', () => {
    const piece = createPieceAtRandomPosition(board, 1);

    expect(piece.isSham).toBe(true);
  });

  it('should generate a non-sham when sham chance is low', () => {
    const piece = createPieceAtRandomPosition(board, 0);

    expect(piece.isSham).toBe(false);
  });

  it('should generate different pieces at different positions', () => {
    const piece1 = createPieceAtRandomPosition(board, 0.5);
    const piece2 = createPieceAtRandomPosition(board, 0.5);

    expect(piece1).not.toBe(piece2);
    expect(piece1.position).not.toEqual(piece2.position);
  });

  it('should add a piece to the Board pieces array', () => {
    const piece = createPieceAtRandomPosition(board, 1);

    expect(board.pieces).toHaveLength(1);
    expect(board.pieces).toContain(piece);
  });

  it('should not generate pieces in team area', () => {
    const emptyPositions = board.size.x * board.size.taskArea;
    for (let i = 0; i < emptyPositions; ++i) {
      createPieceAtRandomPosition(board, 0.5);
    }

    for (let x = 0; x < board.size.x; ++x) {
      for (let y = 0; y < board.size.goalArea; ++y) {
        expect(board.getTileAtPosition(new Point(x, y)).piece).toBeNull();
      }
    }

    for (let x = 0; x < board.size.x; ++x) {
      for (
        let y = board.size.taskArea + board.size.goalArea;
        y < board.size.taskArea + board.size.goalArea * 2;
        ++y
      ) {
        expect(board.getTileAtPosition(new Point(x, y)).piece).toBeNull();
      }
    }
  });
});
