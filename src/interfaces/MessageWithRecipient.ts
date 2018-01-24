import { Message } from './Message';

export interface MessageWithRecipient<T> extends Message<T> {
  recipientId: number;
}
