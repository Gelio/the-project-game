import { MessageWithRecipient } from '../MessageWithRecipient';

export interface UnregisterGameResponsePayload {
  unregistered: boolean;
}

export interface UnregisterGameResponse
  extends MessageWithRecipient<UnregisterGameResponsePayload> {
  type: 'UNREGISTER_GAME_RESPONSE';
  senderId: -3;
  recipientId: -1;
}
