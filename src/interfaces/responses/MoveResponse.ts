import { MessageWithRecipient } from '../MessageWithRecipient';

export interface MoveResponsePayload {
  distanceToPiece: number;
  timestamp: number;
}

export interface MoveResponse extends MessageWithRecipient<MoveResponsePayload> {
  type: 'MOVE_RESPONSE';
  senderId: -1;
}
