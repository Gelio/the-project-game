import { ActionDelays } from './ActionDelays';
import { BoardSize } from './BoardSize';

import { GameName } from '../common/GameName';

export interface TeamSizes {
  '1': number;
  '2': number;
}

export interface GameDefinition {
  name: GameName;
  description: string;
  teamSizes: TeamSizes;
  boardSize: BoardSize;
  goalLimit: number;
  delays: ActionDelays;
}
