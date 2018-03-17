import { Message } from '../Message';

import { GameDefinition } from '../GameDefinition';

export interface RegisterGameRequestPayload {
  game: GameDefinition;
}

export interface RegisterGameRequest extends Message<GameDefinition> {
  type: 'REGISTER_GAME_REQUEST';
  senderId: -1;
}
