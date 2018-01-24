import { MessageWithRecipient } from '../MessageWithRecipient';

export interface ActionValidMessage extends MessageWithRecipient<{ delay: number }> {
  type: 'ACTION_VALID';
  senderId: -1;
}
