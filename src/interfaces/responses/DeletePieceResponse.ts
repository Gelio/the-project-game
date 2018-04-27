import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface DeletePieceResponse extends MessageWithRecipient<undefined> {
  type: 'DELETE_PIECE_RESPONSE';
  senderId: GameMasterId;
}
