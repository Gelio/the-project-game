import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameDefinition } from '../../interfaces/GameDefinition';

export interface ListGamesResponsePayload {
  games: GameDefinition[];
}

export interface ListGamesResponse extends MessageWithRecipient<ListGamesResponsePayload> {
  type: 'LIST_GAMES_RESPONSE';
  senderId: -3;
}
