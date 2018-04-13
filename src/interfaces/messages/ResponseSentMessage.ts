import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface ResponseSentMessage extends MessageWithRecipient<undefined> {
  type: 'RESPONSE_SENT';
  senderId: GameMasterId;
}
