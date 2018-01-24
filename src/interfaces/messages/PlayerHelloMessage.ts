import { Message } from '../Message';

export interface PlayerHelloMessage
  extends Message<{ teamId: number; isLeader: boolean; temporaryId: number }> {
  type: 'PLAYER_HELLO';
  senderId: -2;
}
