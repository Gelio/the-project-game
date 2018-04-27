import { Message } from '../Message';

export interface ListGamesRequest extends Message<undefined> {
  type: 'LIST_GAMES_REQUEST';
}
