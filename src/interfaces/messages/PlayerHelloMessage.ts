import { Message } from '../Message';

import { TeamId } from '../../common/TeamId';

export interface PlayerHelloMessagePayload {
  game: string;
  teamId: TeamId;
  isLeader: boolean;
  temporaryId: number;
}

export interface PlayerHelloMessage extends Message<PlayerHelloMessagePayload> {
  type: 'PLAYER_HELLO';
  senderId: -2;
}
