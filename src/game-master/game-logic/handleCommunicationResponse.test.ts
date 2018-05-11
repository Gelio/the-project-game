import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { BoardInfo } from '../../interfaces/BoardInfo';

import { ResponseSentMessage } from '../../interfaces/messages/ResponseSentMessage';
import {
  AcceptedCommunicationResponseToSender,
  CommunicationResponseFromRecipient,
  RejectedCommunicationResponseToSender
} from '../../interfaces/responses/CommunicationResponse';

import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';
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
  let sender: Player;
  let actionDelays: ActionDelays;
  let logger: LoggerInstance;
  let communicationRequestsStore: CommunicationRequestsStore;

  let sendMessage: SendMessageFn;

  let asker: Player;
  let playersContainer: PlayersContainer;

  beforeEach(() => {
    sender = new Player();
    sender.playerId = 'p2';
    sender.isLeader = false;

    asker = new Player();
    asker.playerId = 'p1';
    asker.isLeader = false;

    playersContainer = new PlayersContainer();
    playersContainer.addPlayer(sender);
    playersContainer.addPlayer(asker);

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
        playersContainer,
        actionDelays: <any>actionDelays,
        logger,
        scoreboard: <any>null,
        sendMessage,
        onPointsLimitReached: jest.fn()
      },
      sender,
      message
    );
  }

  describe('when there is no pending communication request', () => {
    it('should reject communication response', () => {
      const result = executeHandleCommunicationResponse(
        asker.playerId,
        sender.playerId,
        true,
        <any>null
      );

      expect(result.valid).toBe(false);
    });
  });

  describe('rejected communication response', () => {
    it('should return response immediately', async () => {
      jest.useFakeTimers();

      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse(
        asker.playerId,
        sender.playerId,
        false,
        <any>null
      );

      jest.advanceTimersByTime(0);

      const response = await result.responseMessage;

      expect(response.recipientId).toBe(sender.playerId);

      jest.useRealTimers();
    });

    it('should remove pending communication request immediately', () => {
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);

      executeHandleCommunicationResponse(asker.playerId, sender.playerId, false, <any>null);

      expect(communicationRequestsStore.isRequestPending(asker.playerId, sender.playerId)).toBe(
        false
      );
    });

    it('should send message to communication requester', async () => {
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse(
        asker.playerId,
        sender.playerId,
        false,
        <any>null
      );

      await result.responseMessage;

      const responseToAskingPlayer: RejectedCommunicationResponseToSender = {
        type: 'COMMUNICATION_RESPONSE',
        senderId: GAME_MASTER_ID,
        recipientId: asker.playerId,
        payload: {
          accepted: false,
          senderPlayerId: sender.playerId
        }
      };

      expect(sendMessage).toHaveBeenCalledTimes(1);
      expect(sendMessage).toHaveBeenCalledWith(responseToAskingPlayer);
    });

    it('should mark communication response as invalid when the asker is a Leader', () => {
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);
      asker.isLeader = true;

      const result = executeHandleCommunicationResponse(
        asker.playerId,
        sender.playerId,
        false,
        <any>null
      );

      expect(result.valid).toBe(false);
    });

    it('should mark communication response as invalid when the sender is a Leader', () => {
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);
      sender.isLeader = true;

      const result = executeHandleCommunicationResponse(
        asker.playerId,
        sender.playerId,
        false,
        <any>null
      );

      expect(result.valid).toBe(false);
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
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse(asker.playerId, sender.playerId, true, <any>null);

      jest.advanceTimersByTime(actionDelays.communicationAccept);

      await result.responseMessage;

      expect(communicationRequestsStore.isRequestPending(asker.playerId, sender.playerId)).toBe(
        false
      );
    });

    it('should send message to communication requester', async () => {
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse(asker.playerId, sender.playerId, true, <any>null);

      jest.advanceTimersByTime(actionDelays.communicationAccept);

      await result.responseMessage;

      const responseToAskingPlayer: AcceptedCommunicationResponseToSender = {
        type: 'COMMUNICATION_RESPONSE',
        senderId: GAME_MASTER_ID,
        recipientId: asker.playerId,
        payload: {
          accepted: true,
          board: <any>null,
          senderPlayerId: sender.playerId
        }
      };

      expect(sendMessage).toHaveBeenCalledTimes(1);
      expect(sendMessage).toHaveBeenCalledWith(responseToAskingPlayer);
    });

    it('should not send the response to communication requester before action delay', () => {
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);

      executeHandleCommunicationResponse(asker.playerId, sender.playerId, true, <any>null);

      jest.advanceTimersByTime(actionDelays.communicationAccept - 1);

      expect(sendMessage).toHaveBeenCalledTimes(0);
    });

    it('should resolve the response after action delay', async () => {
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse(asker.playerId, sender.playerId, true, <any>null);

      jest.advanceTimersByTime(actionDelays.communicationAccept);

      const response = await result.responseMessage;

      expect(response.recipientId).toBe(sender.playerId);
    });

    it('should not resolve the response before action delay', () => {
      communicationRequestsStore.addPendingRequest(asker.playerId, sender.playerId);
      let resolved = false;

      const result: ValidMessageResult<
        ResponseSentMessage
      > = <any>executeHandleCommunicationResponse(asker.playerId, sender.playerId, true, <any>null);

      result.responseMessage.then(() => {
        resolved = true;
      });

      jest.advanceTimersByTime(actionDelays.communicationAccept - 1);

      expect(resolved).toBe(false);
    });
  });
});
