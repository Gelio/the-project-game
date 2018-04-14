import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface TestPieceResponsePayload {
  isSham: boolean;
}

export interface TestPieceResponse extends MessageWithRecipient<TestPieceResponsePayload> {
  type: 'TEST_PIECE_RESPONSE';
  senderId: GameMasterId;
}
