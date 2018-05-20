import { GameMasterOptions } from '../GameMaster';

import { validateJSON } from '../../common/validation/validateJSON';

// tslint:disable-next-line no-require-imports no-var-requires
const gmConfigSchema = require('../../../schemas/configs/game-master-config.json');

export async function validateGameMasterConfig(config: GameMasterOptions) {
  await validateJSON(gmConfigSchema, config);

  const taskAreaSize = config.boardSize.taskArea * config.boardSize.x;
  const goalAreaSize = config.boardSize.goalArea * config.boardSize.x;

  if (config.piecesLimit > taskAreaSize) {
    throw new Error(
      'There cannot be more pieces on the board than there are tiles in the task area'
    );
  }

  if (config.teamSizes[1] > goalAreaSize) {
    throw new Error('Team 1 has a greater capacity than there are tiles in its area');
  }

  if (config.teamSizes[2] > goalAreaSize) {
    throw new Error('Team 2 has a greater capacity than there are tiles in its area');
  }
}
