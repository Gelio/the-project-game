import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';

import { RequestSentMessage } from '../../interfaces/messages/RequestSentMessage';
import {
  CommunicationRequestFromSender,
  CommunicationRequestToRecipient
} from '../../interfaces/requests/CommunicationRequest';

import { ProcessMessageResult, ValidMessageResult } from '../ProcessMessageResult';
import { SendMessageFn } from '../SendMessageFn';

import { GAME_MASTER_ID, PlayerId } from '../../common/EntityIds';
import { LoggerFactory } from '../../common/logging/LoggerFactory';

import { handleCommunicationRequest } from './handleCommunicationRequest';

import { CommunicationRequestsStore } from '../communication/CommunicationRequestsStore';

function createRequestToRecipient(
  senderId: PlayerId,
  recipientId: PlayerId
): CommunicationRequestFromSender {
  return {
    type: 'COMMUNICATION_REQUEST',
    payload: { targetPlayerId: recipientId },
    senderId: senderId
  };
}

describe('[GM] handleCommunicationRequest', () => {
  let actionDelays: ActionDelays;
  let logger: LoggerInstance;
  let communicationRequestsStore: CommunicationRequestsStore;

  let sendMessage: SendMessageFn;

  beforeEach(() => {
    actionDelays = <any>{
      communicationRequest: 500
    };

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();

    sendMessage = jest.fn();

    communicationRequestsStore = new CommunicationRequestsStore();
  });

  function executeHandleCommunicationRequest(
    senderId: PlayerId,
    recipientId: PlayerId
  ): ProcessMessageResult<RequestSentMessage> {
    const message = createRequestToRecipient(senderId, recipientId);

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    return handleCommunicationRequest(
      communicationRequestsStore,
      {
        board: <any>null,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger,
        scoreboard: <any>null,
        sendMessage,
        onPointsLimitReached: jest.fn()
      },
      <any>null,
      message
    );
  }

  describe('when there is pending communication request', () => {
    it('should reject communication response', () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result = executeHandleCommunicationRequest('p1', 'p2');

      expect(result.valid).toBe(false);
    });

    it('should not send the communication request to target player', () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      executeHandleCommunicationRequest('p1', 'p2');

      jest.advanceTimersByTime(actionDelays.communicationRequest);

      expect(sendMessage).toHaveBeenCalledTimes(0);
    });
  });

  describe('when there is no pending communication request', () => {
    it('should accept communication response', () => {
      const result = executeHandleCommunicationRequest('p1', 'p2');

      expect(result.valid).toBe(true);
    });
  });

  it('should add pending communication request', () => {
    executeHandleCommunicationRequest('p1', 'p2');

    expect(communicationRequestsStore.isRequestPending('p1', 'p2')).toBe(true);
  });

  it('should send message to recipient', async () => {
    const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
      'p1',
      'p2'
    );

    jest.advanceTimersByTime(actionDelays.communicationRequest);

    await result.responseMessage;

    const requestToRecipient: CommunicationRequestToRecipient = {
      type: 'COMMUNICATION_REQUEST',
      senderId: GAME_MASTER_ID,
      recipientId: 'p2',
      payload: {
        senderPlayerId: 'p1'
      }
    };

    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith(requestToRecipient);
  });

  it('should not send the response to communication requester before action delay', () => {
    executeHandleCommunicationRequest('p1', 'p2');

    jest.advanceTimersByTime(actionDelays.communicationRequest - 1);

    expect(sendMessage).toHaveBeenCalledTimes(0);
  });

  it('should resolve the response after action delay', async () => {
    const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
      'p1',
      'p2'
    );

    jest.advanceTimersByTime(actionDelays.communicationRequest);

    const response = await result.responseMessage;

    expect(response.recipientId).toBe('p1');
  });

  it('should not resolve the response before action delay', () => {
    let resolved = false;

    const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
      'p1',
      'p2'
    );

    result.responseMessage.then(() => {
      resolved = true;
    });

    jest.advanceTimersByTime(actionDelays.communicationRequest - 1);
    expect(resolved).toBe(false);
  });
});
