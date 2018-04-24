import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';

import { RequestSentMessage } from '../../interfaces/messages/RequestSentMessage';

import {
  CommunicationRequestFromSender,
  CommunicationRequestToRecipient
} from '../../interfaces/requests/CommunicationRequest';

import { Player } from '../Player';
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
  let sender: Player;
  let sendMessage: SendMessageFn;

  beforeEach(() => {
    actionDelays = <any>{
      communicationRequest: 70
    };

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();

    sender = new Player();
    sender.playerId = 'p1';

    communicationRequestsStore = new CommunicationRequestsStore();

    sendMessage = jest.fn();
  });

  function executeHandleCommunicationRequest(
    senderId: PlayerId,
    recipientId: PlayerId
  ): ProcessMessageResult<RequestSentMessage> {
    const message = createRequestToRecipient(senderId, recipientId);

    return handleCommunicationRequest(
      communicationRequestsStore,
      {
        board: <any>null,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger,
        scoreboard: <any>null,
        sendMessage
      },
      sender,
      message
    );
  }

  describe('when there is pending communication request', () => {
    it('should reject communication response', () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
        'p1',
        'p2'
      );

      expect(result.valid).toBe(false);
    });
  });

  describe('when there is no pending communication request', () => {
    it('should accept communication response', () => {
      const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
        'p1',
        'p2'
      );

      expect(result.valid).toBe(true);
    });
  });

  it('should remove add pending communication request', () => {
    communicationRequestsStore.addPendingRequest('p1', 'p2');

    executeHandleCommunicationRequest('p1', 'p2');

    expect(communicationRequestsStore.isRequestPending('p1', 'p2')).toBe(true);
  });

  it('should send message to recipient', async () => {
    const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
      'p1',
      'p2'
    );

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

  it('should not send the response to asker before action delay', () => {
    jest.useFakeTimers();

    communicationRequestsStore.addPendingRequest('p1', 'p2');

    executeHandleCommunicationRequest('p1', 'p2');

    jest.advanceTimersByTime(actionDelays.communicationRequest - 1);

    expect(sendMessage).toHaveBeenCalledTimes(0);

    jest.useRealTimers();
  });

  it('should resolve the response after action delay', () => {
    jest.useFakeTimers();

    const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
      'p1',
      'p2'
    );

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe('p1');
    });

    jest.advanceTimersByTime(actionDelays.communicationRequest);
    expect.assertions(1);

    jest.useRealTimers();
  });

  it('should not resolve the response before action delay', () => {
    jest.useFakeTimers();

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

    jest.useRealTimers();
  });
});
