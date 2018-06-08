import { GAME_MASTER_ID } from '../../common/EntityIds';

import { GameDefinition } from '../../interfaces/GameDefinition';

import { RegisterGameRequest } from '../../interfaces/requests/RegisterGameRequest';

export function getRegisterGameRequest(gameDefinition: GameDefinition): RegisterGameRequest {
  return {
    type: 'REGISTER_GAME_REQUEST',
    senderId: GAME_MASTER_ID,
    payload: {
      game: gameDefinition
    }
  };
}
