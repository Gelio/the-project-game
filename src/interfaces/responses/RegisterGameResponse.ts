import { MessageWithRecipient } from '../MessageWithRecipient';

interface RegisterGameResponsePayload {
  registered: boolean;
}

export interface RegisterGameResponse extends MessageWithRecipient<RegisterGameResponsePayload> {
  type: 'REGISTER_GAME_RESPONSE';
  senderId: -3;
  recipientId: -1;
}
