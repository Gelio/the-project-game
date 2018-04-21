import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';
import { SendMessageFn } from '../SendMessageFn';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

import { ActionDelays } from '../../interfaces/ActionDelays';

import { ResponseSentMessage } from '../../interfaces/messages/ResponseSentMessage';

import {
  AcceptedCommunicationResponseFromRecipient,
  AcceptedCommunicationResponseToSender,
  CommunicationResponseFromRecipient,
  RejectedCommunicationResponseToSender
} from '../../interfaces/responses/CommunicationResponse';

import { CommunicationRequestsStore } from '../communication/CommunicationRequestsStore';

function handleRejectedResponse(
  communicationResponse: CommunicationResponseFromRecipient,
  sendMessage: SendMessageFn,
  communicationRequestsStore: CommunicationRequestsStore
): ProcessMessageResult<ResponseSentMessage> {
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

  communicationRequestsStore.removePendingRequest(
    communicationResponse.payload.targetPlayerId,
    communicationResponse.senderId
  );

  const responsePromise = Promise.resolve(responseToInformationSource);

  return {
    valid: true,
    delay: 0,
    responseMessage: responsePromise
  };
}

function handleAcceptedResponse(
  communicationResponse: CommunicationResponseFromRecipient,
  sendMessage: SendMessageFn,
  actionDelays: ActionDelays,
  communicationRequestsStore: CommunicationRequestsStore
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
    communicationRequestsStore.removePendingRequest(
      communicationResponse.payload.targetPlayerId,
      communicationResponse.senderId
    );

    return responseToInformationSource;
  });

  return {
    valid: true,
    delay: actionDelays.communicationAccept,
    responseMessage: responsePromise
  };
}

export function handleCommunicationResponse(
  communicationRequestsStore: CommunicationRequestsStore,
  { actionDelays, sendMessage }: MessageHandlerDependencies,
  _sender: Player,
  communicationResponse: CommunicationResponseFromRecipient
): ProcessMessageResult<ResponseSentMessage> {
  if (
    communicationRequestsStore.isRequestPending(
      communicationResponse.payload.targetPlayerId,
      communicationResponse.senderId
    ) === false
  ) {
    return {
      valid: false,
      reason: `No pending communication request from player ${
        communicationResponse.payload.targetPlayerId
      }`
    };
  }

  if (communicationResponse.payload.accepted) {
    return handleAcceptedResponse(
      communicationResponse,
      sendMessage,
      actionDelays,
      communicationRequestsStore
    );
  } else {
    return handleRejectedResponse(communicationResponse, sendMessage, communicationRequestsStore);
  }
}
