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
  RejectedCommunicationResponseFromRecipient,
  RejectedCommunicationResponseToSender
} from '../../interfaces/responses/CommunicationResponse';

import { CommunicationRequestsStore } from '../communication/CommunicationRequestsStore';

function handleRejectedResponse(
  communicationResponse: RejectedCommunicationResponseFromRecipient,
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

  return {
    valid: true,
    delay: 0,
    responseMessage: Promise.resolve(responseToInformationSource)
  };
}

function handleAcceptedResponse(
  communicationResponse: AcceptedCommunicationResponseFromRecipient,
  sendMessage: SendMessageFn,
  actionDelays: ActionDelays,
  communicationRequestsStore: CommunicationRequestsStore
): ProcessMessageResult<ResponseSentMessage> {
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
      boardInfo: communicationResponse.payload.board,
      senderPlayerId: communicationResponse.senderId
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
  { actionDelays, sendMessage, playersContainer }: MessageHandlerDependencies,
  sender: Player,
  communicationResponse: CommunicationResponseFromRecipient
): ProcessMessageResult<ResponseSentMessage> {
  if (
    !communicationRequestsStore.isRequestPending(
      communicationResponse.payload.targetPlayerId,
      communicationResponse.senderId
    )
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
      <AcceptedCommunicationResponseFromRecipient>communicationResponse,
      sendMessage,
      actionDelays,
      communicationRequestsStore
    );
  } else {
    if (sender.isLeader) {
      return {
        valid: false,
        reason: 'Leader cannot refuse communication'
      };
    }

    const recipient = <Player>playersContainer.getPlayerById(
      communicationResponse.payload.targetPlayerId
    );
    if (recipient.isLeader) {
      return {
        valid: false,
        reason: 'Player cannot refuse communication with a leader'
      };
    }

    return handleRejectedResponse(
      <RejectedCommunicationResponseFromRecipient>communicationResponse,
      sendMessage,
      communicationRequestsStore
    );
  }
}
