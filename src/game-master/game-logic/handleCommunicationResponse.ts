import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

import {
  AcceptedCommunicationResponseFromRecipient,
  AcceptedCommunicationResponseToSender,
  CommunicationResponseFromRecipient,
  RejectedCommunicationResponseToSender
} from '../../interfaces/responses/CommunicationResponse';

import { ResponseSentMessage } from '../../interfaces/messages/ResponseSentMessage';
import { SendMessageFn } from '../SendMessageFn';

import { ActionDelays } from '../../interfaces/ActionDelays';

function handleAcceptedResponse(
  communicationResponse: CommunicationResponseFromRecipient,
  sendMessage: SendMessageFn,
  actionDelays: ActionDelays
): ProcessMessageResult<ResponseSentMessage> {
  const acceptedResponse = <AcceptedCommunicationResponseFromRecipient>communicationResponse;
  const responseToInformationSource: ResponseSentMessage = {
    type: 'RESPONSE_SENT',
    senderId: GAME_MASTER_ID,
    recipientId: acceptedResponse.senderId,
    payload: undefined
  };
  const responseToAskingPlayer: AcceptedCommunicationResponseToSender = {
    type: 'COMMUNICATION_RESPONSE',
    senderId: GAME_MASTER_ID,
    recipientId: acceptedResponse.payload.targetPlayerId,
    payload: {
      accepted: true,
      boardInfo: acceptedResponse.payload.board,
      senderPlayerId: acceptedResponse.senderId
    }
  };
  const responsePromise = createDelay(actionDelays.communicationAccept).then(() => {
    sendMessage(responseToAskingPlayer);

    return responseToInformationSource;
  });

  return {
    valid: true,
    delay: actionDelays.communicationAccept,
    responseMessage: responsePromise
  };
}

export function handleCommunicationResponse(
  state: any,
  { actionDelays, sendMessage }: MessageHandlerDependencies,
  _sender: Player,
  communicationResponse: CommunicationResponseFromRecipient
): ProcessMessageResult<ResponseSentMessage> {
  if (
    state[communicationResponse.payload.targetPlayerId][communicationResponse.senderId] ===
    undefined
  ) {
    return {
      valid: false,
      reason: `No pending communication request for player ${
        communicationResponse.payload.targetPlayerId
      }`
    };
  }

  if (communicationResponse.payload.accepted) {
    return handleAcceptedResponse(communicationResponse, sendMessage, actionDelays);
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

    sendMessage(responseToAskingPlayer);

    const responsePromise = Promise.resolve(responseToInformationSource);

    return {
      valid: true,
      delay: 0,
      responseMessage: responsePromise
    };
  }
}
