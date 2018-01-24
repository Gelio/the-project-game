import { Message } from '../Message';
import { MessageWithRecipient } from '../MessageWithRecipient';

/**
 * It would be useful to have both targetPlayerId and senderPlayerId in the payload
 * in order to use the same interface for the player and for the game master
 */
export interface CommunicationRequestFromSender extends Message<{ targetPlayerId: number }> {
  type: 'COMMUNICATION_REQUEST';
}

export interface CommunicationRequestToRecipient
  extends MessageWithRecipient<{ senderPlayerId: number }> {
  type: 'COMMUNICATION_REQUEST';
  senderId: -1;
}
