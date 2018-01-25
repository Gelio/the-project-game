import { Message } from '../Message';

import { TeamId } from '../../common/TeamId';

export interface PlayerHelloMessage
  extends Message<{ teamId: TeamId; isLeader: boolean; temporaryId: number }> {
  type: 'PLAYER_HELLO';
  senderId: -2;
}
