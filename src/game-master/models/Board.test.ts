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
  let pointsLimit: number;

  describe('piece', () => {
    let piece: Piece;
    let piecePosition: Point;
    beforeEach(() => {
      pointsLimit = 15;
      board = new Board(boardSize, pointsLimit);
      board.generateBoard();
      piece = new Piece();
      piecePosition = new Point(1, boardSize.goalArea + 1);
      piece.isPickedUp = false;
      piece.position = piecePosition;
      piece.isSham = false;
      board.addPiece(piece);
    });
    it('add piece on board', () => {
      expect(board.getTileAtPosition(piecePosition).piece).toBe(piece);
    });
    it('add same piece twice', () => {
      expect(board.addPiece.bind(board, piece)).toThrowError('Piece already added');
    });
    it('add two different pieces at same position', () => {
      const samePositionPiece = new Piece();
      samePositionPiece.position = piecePosition;
      expect(board.addPiece.bind(board, samePositionPiece)).toThrowError(
        'Piece already exists at that position'
      );
    });
    it('remove piece from board', () => {
      board.removePiece(piece);
      expect(board.getTileAtPosition(piecePosition).piece).toBeNull();
    });
    it('remove and add piece on same position', () => {
      board.removePiece(piece);
      board.addPiece(piece);
      expect(board.getTileAtPosition(piecePosition).piece).toBe(piece);
    });
    it('move piece to different position', () => {
      const newPiecePosition = new Point(piecePosition.x + 1, piecePosition.y);
      board.movePiece(piece, newPiecePosition);
      expect(board.getTileAtPosition(piecePosition).piece).toBeNull();
      expect(board.getTileAtPosition(newPiecePosition).piece).toBe(piece);
    });
    it('move piece to used position', () => {
      const samePositionPiece = new Piece();
      const newPiecePosition = new Point(piecePosition.x + 1, piecePosition.y);
      samePositionPiece.position = newPiecePosition;
      board.addPiece(samePositionPiece);
      expect(board.movePiece.bind(board, piece, newPiecePosition)).toThrowError(
        'Cannot move a piece on a tile which already has one'
      );
    });
    it('move piece not existing in game', () => {
      const pieceNotAddedToGame = new Piece();
      const newPiecePosition = new Point(piecePosition.x + 1, piecePosition.y);
      pieceNotAddedToGame.position = newPiecePosition;
      expect(board.movePiece.bind(board, pieceNotAddedToGame, newPiecePosition)).toThrowError(
        'Piece has not been added to the game previously'
      );
    });
    it('move corrupted piece', () => {
      piece.position = new Point(piecePosition.x + 1, piecePosition.y);
      expect(board.movePiece.bind(board, piece, piecePosition)).toThrowError(
        'Old piece position corrupted'
      );
    });
  });

  describe('player', () => {
    let player: Player;
    beforeAll(() => {
      board = new Board(boardSize, pointsLimit);
      board.generateBoard();
    });

    beforeEach(() => {
      board.reset();
      player = new Player();
      player.isBusy = player.isConnected = player.isLeader = true;
      player.teamId = 1;
      player.playerId = 1;
    });
    it('should be placed on board', () => {
      board.addPlayer(player);
      expect(board.getTileAtPosition(player.position).player).toBe(player);
    });
    it('should not be placed on board twice', () => {
      board.addPlayer(player);
      const playerPosition = player.position;
      expect(board.addPlayer.bind(board, player)).toThrowError('Player is already added on board');
      expect(player.position).toBe(playerPosition);
    });
    it('should be moved to new position', () => {
      board.addPlayer(player);
      const playerPosition = player.position;
      const newPosition = new Point(playerPosition.x + 1, player.position.y);
      board.movePlayer(player, newPosition);
      expect(player.position).toBe(newPosition);
    });
    it('should throw error when player position does not match board', () => {
      board.addPlayer(player);
      const playerPosition = player.position;
      const newPosition = new Point(playerPosition.x + 1, player.position.y);
      player.position = newPosition;
      expect(board.movePlayer.bind(board, player, newPosition)).toThrowError(
        'Old player position corrupted'
      );
    });
    it('should throw error when player tries to step on tile with player', () => {
      board.addPlayer(player);
      const playerTwo = new Player();
      board.addPlayer(playerTwo);
      expect(board.movePlayer.bind(board, player, playerTwo.position)).toThrowError(
        'Two players cannot stand on the same tile'
      );
    });
  });
});
