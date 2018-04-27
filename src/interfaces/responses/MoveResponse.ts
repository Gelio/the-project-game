import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface MoveResponsePayload {
  distanceToPiece: number;
  timestamp: number;
}

export interface MoveResponse extends MessageWithRecipient<MoveResponsePayload> {
  type: 'MOVE_RESPONSE';
  senderId: GameMasterId;
}
