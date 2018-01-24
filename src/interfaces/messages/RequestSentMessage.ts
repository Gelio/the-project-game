import { MessageWithRecipient } from '../MessageWithRecipient';

export interface RequestSentMessage extends MessageWithRecipient<undefined> {
  type: 'REQUEST_SENT';
  senderId: -1;
}
