import { LoggerInstance } from 'winston';

import { Board } from '../models/Board';
import { Scoreboard } from '../models/Scoreboard';

import { PlayersContainer } from '../PlayersContainer';
import { SendMessageFn } from '../SendMessageFn';

import { ActionDelays } from '../../interfaces/ActionDelays';

export interface MessageHandlerDependencies {
  board: Board;
  playersContainer: PlayersContainer;
  actionDelays: ActionDelays;
  logger: LoggerInstance;
  scoreboard: Scoreboard;
  sendMessage: SendMessageFn;
}
