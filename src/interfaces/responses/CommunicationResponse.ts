import { Message } from '../Message';
import { MessageWithRecipient } from '../MessageWithRecipient';

import { BoardInfo } from '../BoardInfo';

/**
 * It would be useful to have both targetPlayerId and senderPlayerId in the payload
 * in order to use the same interface for the player and for the game master
 */
/**
 * From the player that responds to GM
 */
export interface AcceptedCommunicationResponseFromRecipient
  extends Message<{ targetPlayerId: number; accepted: true; board: BoardInfo }> {
  type: 'COMMUNICATION_RESPONSE';
}

/**
 * From GM to the player that initiated the communication
 */
export interface AcceptedCommunicationResponseToSender
  extends MessageWithRecipient<{ senderPlayerId: number; accepted: true; boardInfo: BoardInfo }> {
  type: 'COMMUNICATION_RESPONSE';
  senderId: -1;
}

/**
 * From the player that responds to GM
 */
export interface RejectedCommunicationResponseFromRecipient
  extends Message<{ targetPlayerId: number; accepted: false }> {
  type: 'COMMUNICATION_RESPONSE';
}

/**
 * From GM to the player that initiated the communication
 */
export interface RejectedCommunicationResponseToSender
  extends MessageWithRecipient<{ senderPlayerId: number; accepted: false }> {
  type: 'COMMUNICATION_RESPONSE';
  senderId: -1;
}

export type CommunicationResponseFromRecipient =
  | AcceptedCommunicationResponseFromRecipient
  | RejectedCommunicationResponseFromRecipient;

export type CommunicationResponseToSender =
  | AcceptedCommunicationResponseToSender
  | RejectedCommunicationResponseToSender;
