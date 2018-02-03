import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';

export interface ValidMessageResult<T> {
  valid: true;
  delay: number;
  responseMessage: Promise<MessageWithRecipient<T>>;
}

export interface InvalidMessageResult {
  valid: false;
  reason: string;
}

export type ProcessMessageResult<T> = ValidMessageResult<T> | InvalidMessageResult;
