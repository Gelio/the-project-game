import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';

export interface TeamSizes {
  '1': number;
  '2': number;
}

export class GameDefinition {
  public name = '';
  public description = '';
  public teamSizes: TeamSizes;
  public boardSize: BoardSize;
  public maxRounds: number;
  public goalLimit: number;
  public delays: ActionDelays;
}
