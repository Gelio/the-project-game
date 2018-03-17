import { MessageWithRecipient } from '../MessageWithRecipient';

export interface PlaceDownPieceResponsePayload {
  didCompleteGoal?: boolean;
}

export interface PlaceDownPieceResponse
  extends MessageWithRecipient<PlaceDownPieceResponsePayload> {
  type: 'PLACE_DOWN_PIECE_RESPONSE';
  senderId: -1;
}
