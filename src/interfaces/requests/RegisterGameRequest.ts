import { GameDefinition } from '../GameDefinition';
import { Message } from '../Message';

import { GameMasterId } from '../../common/EntityIds';

export interface RegisterGameRequestPayload {
  game: GameDefinition;
}

export interface RegisterGameRequest extends Message<GameDefinition> {
  type: 'REGISTER_GAME_REQUEST';
  senderId: GameMasterId;
}
