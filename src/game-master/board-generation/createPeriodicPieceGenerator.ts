import { LoggerInstance } from 'winston';

import { Board } from '../models/Board';

import { PeriodicPieceGenerator, PeriodicPieceGeneratorOptions } from './PeriodicPieceGenerator';

export type PeriodicPieceGeneratorFactory = (board: Board) => PeriodicPieceGenerator;

export function createPeriodicPieceGenerator(
  options: PeriodicPieceGeneratorOptions,
  logger: LoggerInstance
): PeriodicPieceGeneratorFactory {
  return (board: Board) => new PeriodicPieceGenerator(board, options, logger);
}
