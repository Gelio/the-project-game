import { LoggerInstance } from 'winston';

import { Board } from '../models/Board';
import { Scoreboard } from '../models/Scoreboard';

import { GameMasterOptions } from '../GameMaster';
import { PlayersContainer } from '../PlayersContainer';

export interface UIController {
  init(): void;

  destroy(): void;

  render(): void;

  updateBoard(board: Board): void;

  updateGameInfo(
    currentRound: number,
    gameMasterOptions: GameMasterOptions,
    board: Board,
    scoreboard: Scoreboard,
    playersContainer: PlayersContainer
  ): void;

  createLogger(): LoggerInstance;
}
