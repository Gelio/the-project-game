import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface PlayerAcceptedMessage extends MessageWithRecipient<undefined> {
  type: 'PLAYER_ACCEPTED';
  senderId: GameMasterId;
}
