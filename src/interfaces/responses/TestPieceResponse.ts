import { MessageWithRecipient } from '../MessageWithRecipient';

export interface TestPieceResponse extends MessageWithRecipient<{ isSham: boolean }> {
  type: 'TEST_PIECE_RESPONSE';
  senderId: -1;
}
