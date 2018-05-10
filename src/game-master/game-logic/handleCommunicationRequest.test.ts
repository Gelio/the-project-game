import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';

import { RequestSentMessage } from '../../interfaces/messages/RequestSentMessage';
import {
  CommunicationRequestFromSender,
  CommunicationRequestToRecipient
} from '../../interfaces/requests/CommunicationRequest';

import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';
import { ProcessMessageResult, ValidMessageResult } from '../ProcessMessageResult';
import { SendMessageFn } from '../SendMessageFn';

import { GAME_MASTER_ID, PlayerId } from '../../common/EntityIds';
import { LoggerFactory } from '../../common/logging/LoggerFactory';

import { handleCommunicationRequest } from './handleCommunicationRequest';

import { CommunicationRequestsStore } from '../communication/CommunicationRequestsStore';

function createRequestFromSender(
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
  let playersContainer: PlayersContainer;
  let sender: Player;
  let recipient: Player;

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

    sender = new Player();
    sender.playerId = 'p1';

    recipient = new Player();
    recipient.playerId = 'p2';

    playersContainer = new PlayersContainer();
    playersContainer.addPlayer(sender);
    playersContainer.addPlayer(recipient);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function executeHandleCommunicationRequest(
    senderId: PlayerId,
    recipientId: PlayerId
  ): ProcessMessageResult<RequestSentMessage> {
    const message = createRequestFromSender(senderId, recipientId);

    return handleCommunicationRequest(
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
      <any>null,
      message
    );
  }

  it('should reject communication request for invalid recipient id types', () => {
    expect(executeHandleCommunicationRequest(sender.playerId, <any>null).valid).toBe(false);
    expect(executeHandleCommunicationRequest(sender.playerId, <any>undefined).valid).toBe(false);
    expect(executeHandleCommunicationRequest(sender.playerId, <any>1).valid).toBe(false);
    expect(executeHandleCommunicationRequest(sender.playerId, <any>{}).valid).toBe(false);
  });

  it('should rejeect communication request for non existing recipient', () => {
    expect(executeHandleCommunicationRequest(sender.playerId, 'non existing player').valid).toBe(
      false
    );
  });

  describe('when there is pending communication request', () => {
    it('should reject communication request', () => {
      communicationRequestsStore.addPendingRequest(sender.playerId, recipient.playerId);

      const result = executeHandleCommunicationRequest(sender.playerId, recipient.playerId);

      expect(result.valid).toBe(false);
    });

    it('should not send the communication request to target player', () => {
      communicationRequestsStore.addPendingRequest(sender.playerId, recipient.playerId);

      executeHandleCommunicationRequest(sender.playerId, recipient.playerId);

      jest.advanceTimersByTime(actionDelays.communicationRequest);

      expect(sendMessage).toHaveBeenCalledTimes(0);
    });
  });

  describe('when there is no pending communication request', () => {
    it('should accept communication response', () => {
      const result = executeHandleCommunicationRequest(sender.playerId, recipient.playerId);

      expect(result.valid).toBe(true);
    });

    it('should add pending communication request', () => {
      executeHandleCommunicationRequest(sender.playerId, recipient.playerId);

      expect(communicationRequestsStore.isRequestPending(sender.playerId, recipient.playerId)).toBe(
        true
      );
    });

    it('should send message to recipient', async () => {
      const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
        sender.playerId,
        recipient.playerId
      );

      jest.advanceTimersByTime(actionDelays.communicationRequest);

      await result.responseMessage;

      const requestToRecipient: CommunicationRequestToRecipient = {
        type: 'COMMUNICATION_REQUEST',
        senderId: GAME_MASTER_ID,
        recipientId: recipient.playerId,
        payload: {
          senderPlayerId: sender.playerId
        }
      };

      expect(sendMessage).toHaveBeenCalledTimes(1);
      expect(sendMessage).toHaveBeenCalledWith(requestToRecipient);
    });

    it('should not send the message to communication request recipient before action delay', () => {
      executeHandleCommunicationRequest(sender.playerId, recipient.playerId);

      jest.advanceTimersByTime(actionDelays.communicationRequest - 1);

      expect(sendMessage).toHaveBeenCalledTimes(0);
    });

    it('should resolve the response after action delay', async () => {
      const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
        sender.playerId,
        recipient.playerId
      );

      jest.advanceTimersByTime(actionDelays.communicationRequest);

      const response = await result.responseMessage;

      expect(response.recipientId).toBe(sender.playerId);
    });

    it('should not resolve the response before action delay', () => {
      let resolved = false;

      const result: ValidMessageResult<RequestSentMessage> = <any>executeHandleCommunicationRequest(
        sender.playerId,
        recipient.playerId
      );

      result.responseMessage.then(() => {
        resolved = true;
      });

      jest.advanceTimersByTime(actionDelays.communicationRequest - 1);
      expect(resolved).toBe(false);
    });
  });
});
