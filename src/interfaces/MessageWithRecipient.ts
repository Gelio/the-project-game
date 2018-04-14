import { Message } from './Message';

import { EntityId } from '../common/EntityIds';

export interface MessageWithRecipient<T> extends Message<T> {
  recipientId: EntityId;
}
