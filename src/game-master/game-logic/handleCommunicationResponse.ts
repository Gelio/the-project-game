import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';
import { getPositionInDirection } from '../../common/getPositionInDirection';
import { Point } from '../../common/Point';

import { Tile } from '../models/tiles/Tile';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

import {
  AcceptedCommunicationResponseFromRecipient,
  AcceptedCommunicationResponseToSender,
  CommunicationResponseFromRecipient,
  CommunicationResponseToSender,
  RejectedCommunicationResponseFromRecipient,
  RejectedCommunicationResponseToSender
} from '../../interfaces/responses/CommunicationResponse';

import { ActionInvalidMessage } from '../../interfaces/messages/ActionInvalidMessage';
import { ActionValidMessage } from '../../interfaces/messages/ActionValidMessage';
import { ResponseSentMessage } from '../../interfaces/messages/ResponseSentMessage';
import { MessageWithRecipient } from '../../interfaces/MessageWithRecipient';

export function handleCommunicationResponse(
  state: any,
  { board, actionDelays, logger }: MessageHandlerDependencies,
  sender: Player,
  communicationResponse: CommunicationResponseFromRecipient
) {
  if (
    state[communicationResponse.payload.targetPlayerId][communicationResponse.senderId] ===
    undefined
  ) {
    return {
      valid: false,
      reason: `No pending communication response for player ${
        communicationResponse.payload.targetPlayerId
      }`
    };
  }

  const acceptedCommunicationResponse = <AcceptedCommunicationResponseFromRecipient>communicationResponse;
  if (acceptedCommunicationResponse) {
    //promise.resolve

    const responseToInformationSource: ResponseSentMessage = {
      type: 'RESPONSE_SENT',
      senderId: GAME_MASTER_ID,
      recipientId: communicationResponse.senderId,
      payload: undefined
    };

    const responseToAskingPlayer: AcceptedCommunicationResponseToSender = {
      type: 'COMMUNICATION_RESPONSE',
      senderId: GAME_MASTER_ID,
      recipientId: communicationResponse.payload.targetPlayerId,
      payload: {
        accepted: true,
        boardInfo: acceptedCommunicationResponse.payload.board,
        senderPlayerId: communicationResponse.senderId
      }
    };
  } else {
    const responseToAskingPlayer: RejectedCommunicationResponseToSender = {
      type: 'COMMUNICATION_RESPONSE',
      senderId: GAME_MASTER_ID,
      recipientId: communicationResponse.payload.targetPlayerId,
      payload: {
        accepted: false,
        senderPlayerId: communicationResponse.senderId
      }
    };

    const responseToInformationSource: ResponseSentMessage = {
      type: 'RESPONSE_SENT',
      senderId: GAME_MASTER_ID,
      recipientId: communicationResponse.senderId,
      payload: undefined
    };
  }

  return {
    valid: true,
    delay: actionDelays.communicationAccept
  };
}
