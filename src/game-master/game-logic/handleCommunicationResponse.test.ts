import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { BoardInfo } from '../../interfaces/BoardInfo';

import { ResponseSentMessage } from '../../interfaces/messages/ResponseSentMessage';
import {
  AcceptedCommunicationResponseToSender,
  CommunicationResponseFromRecipient,
  RejectedCommunicationResponseToSender
} from '../../interfaces/responses/CommunicationResponse';

import { ValidMessageResult } from '../ProcessMessageResult';
import { SendMessageFn } from '../SendMessageFn';

import { GAME_MASTER_ID, PlayerId } from '../../common/EntityIds';
import { LoggerFactory } from '../../common/logging/LoggerFactory';

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

  let sendMessage: SendMessageFn;

  beforeEach(() => {
    actionDelays = <any>{
      communicationAccept: 500
    };

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();

    sendMessage = jest.fn();

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
        sendMessage,
        onPointsLimitReached: jest.fn()
      },
      <any>null,
      message
    );
  }

  describe('when there is no pending communication request', () => {
    it('should reject communication response', () => {
      const result = executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      expect(result.valid).toBe(false);
    });
  });

  describe('rejected communication response', () => {
    it('should return response immediately', async () => {
      jest.useFakeTimers();

      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', false, <any>null);

      jest.advanceTimersByTime(0);

      const response = await result.responseMessage;

      expect(response.recipientId).toBe('p2');

      jest.useRealTimers();
    });

    it('should remove pending communication request immediately', () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      executeHandleCommunicationResponse('p1', 'p2', false, <any>null);

      expect(communicationRequestsStore.isRequestPending('p1', 'p2')).toBe(false);
    });

    it('should send message to communication requester', async () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', false, <any>null);

      await result.responseMessage;

      const responseToAskingPlayer: RejectedCommunicationResponseToSender = {
        type: 'COMMUNICATION_RESPONSE',
        senderId: GAME_MASTER_ID,
        recipientId: 'p1',
        payload: {
          accepted: false,
          senderPlayerId: 'p2'
        }
      };

      expect(sendMessage).toHaveBeenCalledTimes(1);
      expect(sendMessage).toHaveBeenCalledWith(responseToAskingPlayer);
    });
  });

  describe('accepted communication response', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should remove pending communication request after delay', async () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      jest.advanceTimersByTime(actionDelays.communicationAccept);

      await result.responseMessage;

      expect(communicationRequestsStore.isRequestPending('p1', 'p2')).toBe(false);
    });

    it('should send message to communication requester', async () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      jest.advanceTimersByTime(actionDelays.communicationAccept);

      await result.responseMessage;

      const responseToAskingPlayer: AcceptedCommunicationResponseToSender = {
        type: 'COMMUNICATION_RESPONSE',
        senderId: GAME_MASTER_ID,
        recipientId: 'p1',
        payload: {
          accepted: true,
          boardInfo: <any>null,
          senderPlayerId: 'p2'
        }
      };

      expect(sendMessage).toHaveBeenCalledTimes(1);
      expect(sendMessage).toHaveBeenCalledWith(responseToAskingPlayer);
    });

    it('should not send the response to communication requester before action delay', () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      jest.advanceTimersByTime(actionDelays.communicationAccept - 1);

      expect(sendMessage).toHaveBeenCalledTimes(0);
    });

    it('should resolve the response after action delay', async () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      jest.advanceTimersByTime(actionDelays.communicationAccept);

      const response = await result.responseMessage;

      expect(response.recipientId).toBe('p2');
    });

    it('should not resolve the response before action delay', () => {
      communicationRequestsStore.addPendingRequest('p1', 'p2');
      let resolved = false;

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse('p1', 'p2', true, <any>null);

      result.responseMessage.then(() => {
        resolved = true;
      });

      jest.advanceTimersByTime(actionDelays.communicationAccept - 1);

      expect(resolved).toBe(false);
    });
  });
});
