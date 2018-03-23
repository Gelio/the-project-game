import { LoggerInstance } from 'winston';

import { Board } from '../models/Board';

import { PeriodicPieceGenerator, PeriodicPieceGeneratorOptions } from './PeriodicPieceGenerator';

import { LoggerFactory } from '../../common/logging/LoggerFactory';

describe('[GM] PeriodicPieceGenerator', () => {
  let board: Board;
  let options: PeriodicPieceGeneratorOptions;
  let logger: LoggerInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllTimers();

    board = new Board(
      {
        goalArea: 10,
        taskArea: 20,
        x: 10
      },
      20
    );
    options = {
      checkInterval: 100,
      piecesLimit: 5,
      shamChance: 0.5
    };

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();
  });

  it('should instantiate correctly', () => {
    expect(new PeriodicPieceGenerator(board, options, logger)).toBeDefined();
  });

  it('should initialize correctly', () => {
    const generator = new PeriodicPieceGenerator(board, options, logger);

    expect(() => {
      generator.init();
      generator.destroy();
    }).not.toThrow();
  });

  describe('init', () => {
    it('should generate pieces on the board', () => {
      const generator = new PeriodicPieceGenerator(board, options, logger);
      generator.init();

      expect(board.pieces).toHaveLength(5);
    });
  });

  describe('after init', () => {
    let generator: PeriodicPieceGenerator;

    beforeEach(() => {
      generator = new PeriodicPieceGenerator(board, options, logger);
      generator.init();
    });

    afterEach(() => {
      generator.destroy();
    });

    it('should do nothing when the board is full', () => {
      jest.runOnlyPendingTimers();

      expect(board.pieces).toHaveLength(5);
    });

    it('should generate a piece when there is room on the board', () => {
      board.removePiece(board.pieces[0]);

      jest.runOnlyPendingTimers();

      expect(board.pieces).toHaveLength(5);
    });

    it('should have the interval specified in the options', () => {
      board.removePiece(board.pieces[0]);

      jest.advanceTimersByTime(options.checkInterval);

      expect(board.pieces).toHaveLength(5);
    });
  });
});
