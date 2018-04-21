import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { BoardInfo } from '../../interfaces/BoardInfo';

import { ResponseSentMessage } from '../../interfaces/messages/ResponseSentMessage';

import { CommunicationResponseFromRecipient } from '../../interfaces/responses/CommunicationResponse';

import { ValidMessageResult } from '../ProcessMessageResult';

import { LoggerFactory } from '../../common/logging/LoggerFactory';

import { PlayerId } from '../../common/EntityIds';

import { handleCommunicationResponse } from './handleCommunicationResponse';

import { CommunicationRequestsStore } from '../communication/CommunicationRequestsStore';

function createResponseFromRecipient(
  requesterId: PlayerId,
  askedId: PlayerId,
  accepted: boolean,
  boardInfo: BoardInfo
): CommunicationResponseFromRecipient {
  if (accepted) {
    return {
      senderId: askedId,
      type: 'COMMUNICATION_RESPONSE',
      payload: {
        accepted: true,
        targetPlayerId: requesterId,
        board: boardInfo
      }
    };
  }

  return {
    type: 'COMMUNICATION_RESPONSE',
    senderId: askedId,
    payload: {
      targetPlayerId: requesterId,
      accepted: false
    }
  };
}

describe('[GM] handleCommunicationResponse', () => {
  let actionDelays: ActionDelays;
  let logger: LoggerInstance;
  let communicationRequestsStore: CommunicationRequestsStore;

  beforeEach(() => {
    actionDelays = <any>{
      communicationAccept: 500
    };

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();

    communicationRequestsStore = new CommunicationRequestsStore();
  });

  function executeHandleCommunicationResponse(
    requesterId: PlayerId,
    askedId: PlayerId,
    accepted: boolean,
    boardInfo: BoardInfo
  ) {
    const message = createResponseFromRecipient(requesterId, askedId, accepted, boardInfo);

    return handleCommunicationResponse(
      communicationRequestsStore,
      {
        board: <any>null,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger,
        scoreboard: <any>null,
        sendMessage: jest.fn()
      },
      <any>null,
      message
    );
  }

  describe('when there is no pending communication request', () => {
    it('should reject communication response', () => {
      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      expect(result.valid).toBe(false);
    });
  });

  describe('rejected communication response', () => {
    it('should return response immediately', () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', false, <any>null);

      result.responseMessage.then(response => {
        expect(response.recipientId).toBe('p2');
      });
    });

    it('should remove pending communication request  immediately', async () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      executeHandleCommunicationResponse('p1', 'p2', false, <any>null);

      expect(communicationRequestsStore.isRequestPending('p1', 'p2')).toBe(false);
    });
  });

  describe('accepted communication response', () => {
    it('should remove pending communication request after delay', async () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      await result.responseMessage;

      expect(communicationRequestsStore.isRequestPending('p1', 'p2')).toBe(false);
    });

    it('should resolve the response after action delay', () => {
      jest.useFakeTimers();

      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      result.responseMessage.then(response => {
        expect(response.recipientId).toBe('p2');
      });

      jest.advanceTimersByTime(actionDelays.communicationAccept);
      expect.assertions(1);

      jest.useRealTimers();
    });

    it('should not resolve the response before action delay', done => {
      jest.useFakeTimers();

      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      result.responseMessage.then(() => done.fail('Response resolved before action delay'));

      jest.advanceTimersByTime(actionDelays.communicationAccept - 1);
      jest.useRealTimers();
      done();
    });
  });
});
