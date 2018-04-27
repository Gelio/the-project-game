import { GameMasterOptions } from './GameMaster';

import { GameDefinition } from '../interfaces/GameDefinition';

export function mapOptionsToGameDefinition(options: GameMasterOptions): GameDefinition {
  return {
    name: options.gameName,
    description: options.gameDescription,
    teamSizes: options.teamSizes,
    boardSize: options.boardSize,
    goalLimit: options.pointsLimit,
    delays: options.actionDelays
  };
}
