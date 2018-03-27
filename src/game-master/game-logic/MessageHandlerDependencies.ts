import { LoggerInstance } from 'winston';

import { Board } from '../models/Board';

import { PlayersContainer } from '../PlayersContainer';

import { ActionDelays } from '../../interfaces/ActionDelays';

export interface MessageHandlerDependencies {
  board: Board;
  playersContainer: PlayersContainer;
  actionDelays: ActionDelays;
  logger: LoggerInstance;
}
