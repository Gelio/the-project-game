import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';

import { CommunicationRequestsStore } from '../communication/CommunicationRequestsStore';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

import { RequestSentMessage } from '../../interfaces/messages/RequestSentMessage';
import {
  CommunicationRequestFromSender,
  CommunicationRequestToRecipient
} from '../../interfaces/requests/CommunicationRequest';

export function handleCommunicationRequest(
  communicationRequestsStore: CommunicationRequestsStore,
  { actionDelays, sendMessage, playersContainer }: MessageHandlerDependencies,
  _sender: Player,
  communicationRequest: CommunicationRequestFromSender
): ProcessMessageResult<RequestSentMessage> {
  const senderId = communicationRequest.senderId;
  const recipientId = communicationRequest.payload.targetPlayerId;

  if (!playersContainer.getPlayerById(recipientId)) {
    return {
      valid: false,
      reason: 'Invalid recipient ID - player does not exist'
    };
  }

  if (communicationRequestsStore.isRequestPending(senderId, recipientId)) {
    return {
      valid: false,
      reason: `There is already pending communication request to player ${recipientId}`
    };
  }

  communicationRequestsStore.addPendingRequest(senderId, recipientId);

  const communicationRequstToRecipient: CommunicationRequestToRecipient = {
    type: 'COMMUNICATION_REQUEST',
    payload: { senderPlayerId: senderId },
    recipientId: recipientId,
    senderId: GAME_MASTER_ID
  };

  const responsePromise = createDelay(actionDelays.communicationRequest).then(
    (): RequestSentMessage => {
      sendMessage(communicationRequstToRecipient);

      return {
        type: 'REQUEST_SENT',
        payload: undefined,
        recipientId: senderId,
        senderId: GAME_MASTER_ID
      };
    }
  );

  return {
    valid: true,
    delay: actionDelays.communicationRequest,
    responseMessage: responsePromise
  };
}
