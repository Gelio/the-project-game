import { MessageWithRecipient } from '../MessageWithRecipient';
import { PlayerRequest } from '../PlayerRequest';

import { EntityId, GameMasterId } from '../../common/EntityIds';

export interface CommunicationRequestFromSenderPayload {
  targetPlayerId: EntityId;
}

/**
 * It would be useful to have both targetPlayerId and senderPlayerId in the payload
 * in order to use the same interface for the player and for the game master
 */
export interface CommunicationRequestFromSender
  extends PlayerRequest<CommunicationRequestFromSenderPayload> {
  type: 'COMMUNICATION_REQUEST';
}

export interface CommunicationRequestToRecipientPayload {
  senderPlayerId: EntityId;
}

export interface CommunicationRequestToRecipient
  extends MessageWithRecipient<CommunicationRequestToRecipientPayload> {
  type: 'COMMUNICATION_REQUEST';
  senderId: GameMasterId;
}
