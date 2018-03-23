import { LoggerInstance } from 'winston';

import { Service } from '../../interfaces/Service';

import { Game } from '../Game';

import { createPieceAtRandomPosition } from './createPieceAtRandomPosition';

export interface PeriodicPieceGeneratorOptions {
  shamChance: number;
  piecesLimit: number;
  checkInterval: number;
}

export class PeriodicPieceGenerator implements Service {
  private readonly game: Game;
  private readonly options: PeriodicPieceGeneratorOptions;
  private readonly logger: LoggerInstance;

  private intervalId: NodeJS.Timer | undefined;

  constructor(game: Game, options: PeriodicPieceGeneratorOptions, logger: LoggerInstance) {
    this.game = game;
    this.options = options;
    this.logger = logger;
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
    try {
      while (this.game.board.pieces.length < this.options.piecesLimit) {
        createPieceAtRandomPosition(this.game.board, this.options.shamChance);
      }
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
