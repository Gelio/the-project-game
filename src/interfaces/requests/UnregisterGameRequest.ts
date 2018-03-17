import { MessageWithRecipient } from '../MessageWithRecipient';

export interface UnregisterGameRequestPayload {
  gameName: string;
}

export interface UnregisterGameRequest extends MessageWithRecipient<UnregisterGameRequestPayload> {
  type: 'UNREGISTER_GAME_REQUEST';
  senderId: -1;
  recipientId: -3;
}
