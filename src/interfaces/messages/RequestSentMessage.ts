import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface RequestSentMessage extends MessageWithRecipient<undefined> {
  type: 'REQUEST_SENT';
  senderId: GameMasterId;
}
