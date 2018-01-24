import { MessageWithRecipient } from '../MessageWithRecipient';
import { PlayerPosition } from '../PlayerPosition';

interface RefreshStateResponsePayload {
  timestamp: number;
  currentPositionDistanceToClosestPiece: number;
  playerPositions: PlayerPosition[];
  team1Score: number;
  team2Score: number;
}

export interface RefreshStateResponse extends MessageWithRecipient<RefreshStateResponsePayload> {
  type: 'REFRESH_STATE_RESPONSE';
  senderId: -1;
}
