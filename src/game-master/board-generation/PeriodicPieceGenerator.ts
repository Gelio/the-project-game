import { LoggerInstance } from 'winston';

import { Service } from '../../interfaces/Service';

import { Board } from '../models/Board';

import { createPieceAtRandomPosition } from './createPieceAtRandomPosition';

export interface PeriodicPieceGeneratorOptions {
  shamChance: number;
  piecesLimit: number;
  checkInterval: number;
}

export class PeriodicPieceGenerator implements Service {
  private readonly board: Board;
  private readonly options: PeriodicPieceGeneratorOptions;
  private readonly logger: LoggerInstance;

  private intervalId: NodeJS.Timer | undefined;

  constructor(board: Board, options: PeriodicPieceGeneratorOptions, logger: LoggerInstance) {
    this.board = board;
    this.options = options;
    this.logger = logger;

    this.tryGeneratePieces = this.tryGeneratePieces.bind(this);
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
      while (this.board.pieces.length < this.options.piecesLimit) {
        createPieceAtRandomPosition(this.board, this.options.shamChance);
      }
    } catch (error) {
      this.logger.error(`Cannot generate more piece: ${error.message}`);
    }
  }
}
