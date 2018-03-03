import { Point } from '../../common/Point';
import { Service } from '../../interfaces/Service';
import { Game } from '../Game';
import { Piece } from '../models/Piece';
import { Tile } from '../models/tiles/Tile';

export interface PeriodicPieceGeneratorOptions {
  shamChance: number;
  piecesLimit: number;
  checkInterval: number;
}

export class PeriodicPieceGenerator implements Service {
  private readonly game: Game;
  private readonly options: PeriodicPieceGeneratorOptions;

  private intervalId: NodeJS.Timer | undefined;

  constructor(game: Game, options: PeriodicPieceGeneratorOptions) {
    this.game = game;
    this.options = options;
  }

  public init() {
    if (this.intervalId) {
      this.destroy();
    }

    this.tryGeneratePieces();
    this.intervalId = setInterval(this.tryGeneratePieces, this.options.checkInterval);
  }

  public destroy() {
    if (!this.intervalId) {
      throw new Error('Not started');
    }

    clearInterval(this.intervalId);
  }

  private tryGeneratePieces() {
    while (this.game.board.pieces.length < this.options.piecesLimit) {
      this.createPieceAtRandomPosition();
    }
  }

  private createPieceAtRandomPosition() {
    const minY = this.game.board.size.goalArea + 1;
    const maxY = this.game.board.size.goalArea + this.game.board.size.taskArea;
    const yRange = maxY - minY + 1;

    const boardWidth = this.game.board.size.x;

    let position: Point;
    let tile: Tile;
    do {
      const x = Math.floor(Math.random() * boardWidth);
      const y = Math.floor(minY + Math.random() * yRange);
      position = new Point(x, y);
      tile = this.game.board.getTileAtPosition(new Point(x, y));
    } while (tile.piece && !tile.piece.isPickedUp);

    const piece = new Piece();
    piece.position = position;
    piece.isSham = Math.random() < this.options.shamChance;
    piece.isPickedUp = false;

    this.game.board.addPiece(piece);
  }
}
