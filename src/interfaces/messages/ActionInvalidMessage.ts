import { MessageWithRecipient } from '../MessageWithRecipient';

export interface ActionInvalidMessage extends MessageWithRecipient<{ reason: string }> {
  type: 'ACTION_INVALID';
  senderId: -1;
}
