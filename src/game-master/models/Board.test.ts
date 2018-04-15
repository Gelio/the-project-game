import { Point } from '../../common/Point';

import { BoardSize } from '../../interfaces/BoardSize';

import { Player } from '../Player';

import { Board } from './Board';
import { Piece } from './Piece';

describe('[GM] Board', () => {
  const boardSize: BoardSize = {
    x: 30,
    goalArea: 5,
    taskArea: 30
  };
  let board: Board;
  const pointsLimit: number = 15;

  beforeEach(() => {
    board = new Board(boardSize, pointsLimit);
  });

  describe('(piece)', () => {
    let piece: Piece;
    let piecePosition: Point;

    beforeEach(() => {
      piece = new Piece();
      piecePosition = new Point(1, boardSize.goalArea + 1);
      piece.isPickedUp = false;
      piece.position = piecePosition;
      piece.isSham = false;
      board.addPiece(piece);
    });

    describe('addPiece', () => {
      it('should add piece on the board', () => {
        expect(board.getTileAtPosition(piecePosition).piece).toBe(piece);
      });

      it('should throw an error when piece is added twice', () => {
        expect(board.addPiece.bind(board, piece)).toThrowError('Piece already added');
      });

      it('should throw an error when piece is added on position where another piece already exists', () => {
        const samePositionPiece = new Piece();
        samePositionPiece.position = piecePosition;

        expect(board.addPiece.bind(board, samePositionPiece)).toThrowError(
          'Piece already exists at that position'
        );
      });
    });

    describe('removePiece', () => {
      it('should remove piece from board', () => {
        board.removePiece(piece);

        expect(board.getTileAtPosition(piecePosition).piece).toBeNull();
      });

      it('should throw an error when piece is removed from the board where it does not exist', () => {
        board.removePiece(piece);

        expect(board.removePiece.bind(board, piece)).toThrowError('Piece was not on board');
      });

      it('should not remove piece if it is picked up', () => {
        piece.isPickedUp = true;
        board.removePiece(piece);

        expect(board.getTileAtPosition(piece.position).piece).toBe(piece);
      });
    });

    describe('movePiece', () => {
      it('should move piece to new position', () => {
        const newPiecePosition = new Point(piecePosition.x + 1, piecePosition.y);
        board.movePiece(piece, newPiecePosition);

        expect(board.getTileAtPosition(newPiecePosition).piece).toBe(piece);
      });

      it('should remove piece from the old position after moving it', () => {
        const newPiecePosition = new Point(piecePosition.x + 1, piecePosition.y);
        board.movePiece(piece, newPiecePosition);

        expect(board.getTileAtPosition(piecePosition).piece).toBeNull();
      });

      it('should throw an error when piece is moved to already taken position', () => {
        const samePositionPiece = new Piece();
        const newPiecePosition = new Point(0, 1);
        samePositionPiece.position = newPiecePosition;

        board.addPiece(samePositionPiece);

        expect(board.movePiece.bind(board, piece, newPiecePosition)).toThrowError(
          'Cannot move a piece on a tile which already has one'
        );
      });

      it('should throw an error when piece was not added on the board before', () => {
        const pieceNotAddedToGame = new Piece();
        const newPiecePosition = new Point(piecePosition.x + 1, piecePosition.y);
        pieceNotAddedToGame.position = newPiecePosition;

        expect(board.movePiece.bind(board, pieceNotAddedToGame, newPiecePosition)).toThrowError(
          'Piece has not been added to the game previously'
        );
      });

      it('should throw an error when piece position does not match the one on the board', () => {
        piece.position = new Point(piecePosition.x + 1, piecePosition.y);

        expect(board.movePiece.bind(board, piece, piecePosition)).toThrowError(
          'Old piece position corrupted'
        );
      });
    });

    it('should be removed and added at old position', () => {
      board.removePiece(piece);
      board.addPiece(piece);

      expect(board.getTileAtPosition(piecePosition).piece).toBe(piece);
    });
  });

  describe('(player)', () => {
    let player: Player;

    beforeEach(() => {
      player = new Player();
      player.isBusy = player.isConnected = player.isLeader = true;
      player.teamId = 1;
      player.playerId = 'player1';
    });

    describe('addPlayer', () => {
      it('should place player on the board', () => {
        board.addPlayer(player);

        expect(player.position).toBeDefined();
        expect(board.getTileAtPosition(<Point>player.position).player).toBe(player);
      });

      it('should throw an error when player was already added to the board', () => {
        board.addPlayer(player);
        const playerPosition = player.position;

        expect(board.addPlayer.bind(board, player)).toThrowError(
          'Player is already added on board'
        );
        expect(player.position).toBe(playerPosition);
      });
    });

    describe('movePlayer', () => {
      it('should move player to new position', () => {
        board.addPlayer(player);
        // FIXME: set `newPosition` based on player's position
        const newPosition = new Point(1, 2);

        board.movePlayer(player, newPosition);

        expect(player.position).toBe(newPosition);
      });

      it('should throw an error when player position does not match the one on the board', () => {
        board.addPlayer(player);
        // FIXME: set `newPosition` based on player's position
        const newPosition = new Point(2, 4);

        player.position = newPosition;

        expect(board.movePlayer.bind(board, player, newPosition)).toThrowError(
          'Old player position corrupted'
        );
      });

      it('should throw an error when player is not present on board', () => {
        const newPosition = new Point(2, 4);

        expect(board.movePlayer.bind(board, player, newPosition)).toThrowError(
          'Player position is null'
        );
      });

      it('should throw an error when player tries to step on tile with another player', () => {
        board.addPlayer(player);

        const playerTwo = new Player();
        board.addPlayer(playerTwo);

        expect(board.movePlayer.bind(board, player, playerTwo.position)).toThrowError(
          'Two players cannot stand on the same tile'
        );
      });
    });

    it('should be removed from the board', () => {
      board.addPlayer(player);
      board.removePlayer(player);

      expect(player.position).toBeNull();
    });

    it('should receive new position', () => {
      player.teamId = 2;
      board.addPlayer(player);
      board.setRandomPlayerPosition(player);

      expect(player.position).toBeDefined();
    });
  });

  describe('(tiles)', () => {
    it('should throw an error about invalid X coordinate', () => {
      const point: Point = new Point(30, 1);

      expect(board.getTileAtPosition.bind(board, point)).toThrowError('Invalid X coordinate');
    });

    it('should throw an error about invalid Y coordinate', () => {
      const point: Point = new Point(29, 40);

      expect(board.getTileAtPosition.bind(board, point)).toThrowError('Invalid Y coordinate');
    });

    it('should return the tile if position is valid', () => {
      const point: Point = new Point(0, 0);

      expect(board.getTileAtPosition.bind(board, point)).toBeDefined();
    });
  });
});
