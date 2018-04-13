import { BoardInfo } from '../BoardInfo';
import { Message } from '../Message';
import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId, PlayerId } from '../../common/EntityIds';

/**
 * It would be useful to have both targetPlayerId and senderPlayerId in the payload
 * in order to use the same interface for the player and for the game master
 */

export interface AcceptedCommunicationResponseFromRecipientPayload {
  targetPlayerId: PlayerId;
  accepted: true;
  board: BoardInfo;
}

/**
 * From the player that responds to GM
 */
export interface AcceptedCommunicationResponseFromRecipient
  extends Message<AcceptedCommunicationResponseFromRecipientPayload> {
  type: 'COMMUNICATION_RESPONSE';
}

export interface AcceptedCommunicationResponseToSenderPayload {
  senderPlayerId: PlayerId;
  accepted: true;
  boardInfo: BoardInfo;
}

/**
 * From GM to the player that initiated the communication
 */
export interface AcceptedCommunicationResponseToSender
  extends MessageWithRecipient<AcceptedCommunicationResponseToSenderPayload> {
  type: 'COMMUNICATION_RESPONSE';
  senderId: GameMasterId;
}

export interface RejectedCommunicationResponseFromRecipientPayload {
  targetPlayerId: PlayerId;
  accepted: false;
}

/**
 * From the player that responds to GM
 */
export interface RejectedCommunicationResponseFromRecipient
  extends Message<RejectedCommunicationResponseFromRecipientPayload> {
  type: 'COMMUNICATION_RESPONSE';
}

export interface RejectedCommunicationResponseToSenderPayload {
  senderPlayerId: PlayerId;
  accepted: false;
}

/**
 * From GM to the player that initiated the communication
 */
export interface RejectedCommunicationResponseToSender
  extends MessageWithRecipient<RejectedCommunicationResponseToSenderPayload> {
  type: 'COMMUNICATION_RESPONSE';
  senderId: GameMasterId;
}

export type CommunicationResponseFromRecipient =
  | AcceptedCommunicationResponseFromRecipient
  | RejectedCommunicationResponseFromRecipient;

export type CommunicationResponseToSender =
  | AcceptedCommunicationResponseToSender
  | RejectedCommunicationResponseToSender;
