import { ActionDelays } from './ActionDelays';
import { BoardSize } from './BoardSize';

export interface TeamSizes {
  '1': number;
  '2': number;
}

export interface GameDefinition {
  name: string;
  description: string;
  teamSizes: TeamSizes;
  boardSize: BoardSize;
  maxRounds: number;
  goalLimit: number;
  delays: ActionDelays;
}
