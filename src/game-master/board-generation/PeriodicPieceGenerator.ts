import { arrayShuffle } from '../../common/arrayShuffle';
import { Point } from '../../common/Point';
import { Service } from '../../interfaces/Service';
import { Game } from '../Game';
import { Piece } from '../models/Piece';

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

    const allPositions: Point[] = [];
    for (let y = 0; y < yRange; ++y) {
      for (let x = 0; x < this.game.board.size.x; ++x) {
        allPositions.push(new Point(x, y));
      }
    }

    const piece = new Piece();
    piece.isSham = Math.random() < this.options.shamChance;
    piece.isPickedUp = false;

    arrayShuffle(allPositions);
    for (const position of allPositions) {
      const tile = this.game.board.getTileAtPosition(position);
      if (!tile.piece || !tile.piece.isPickedUp) {
        piece.position = position;
        break;
      }
    }
    this.game.board.addPiece(piece);
  }
}
