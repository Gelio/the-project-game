import { MessageWithRecipient } from '../MessageWithRecipient';

export interface ResponseSentMessage extends MessageWithRecipient<undefined> {
  type: 'RESPONSE_SENT';
  senderId: -1;
}
