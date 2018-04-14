import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface PlaceDownPieceResponsePayload {
  didCompleteGoal?: boolean;
}

export interface PlaceDownPieceResponse
  extends MessageWithRecipient<PlaceDownPieceResponsePayload> {
  type: 'PLACE_DOWN_PIECE_RESPONSE';
  senderId: GameMasterId;
}
