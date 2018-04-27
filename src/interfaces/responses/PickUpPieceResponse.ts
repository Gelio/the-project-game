import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface PickUpPieceResponse extends MessageWithRecipient<undefined> {
  type: 'PICK_UP_PIECE_RESPONSE';
  senderId: GameMasterId;
}
