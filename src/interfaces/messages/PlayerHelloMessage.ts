import { Message } from '../Message';

import { TeamId } from '../../common/TeamId';

export interface PlayerHelloMessagePayload {
  game: string;
  teamId: TeamId;
  isLeader: boolean;
}

export interface PlayerHelloMessage extends Message<PlayerHelloMessagePayload> {
  type: 'PLAYER_HELLO';
}
