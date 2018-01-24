import { Message } from '../Message';

export interface PlayerDisconnectedMessage extends Message<{ playerId: number }> {
  type: 'PLAYER_DISCONNECTED';
  senderId: -3;
  recipientId: -1;
}
