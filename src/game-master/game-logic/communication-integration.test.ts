import { CommunicationRequestsStore } from '../communication/CommunicationRequestsStore';

import { ActionDelays } from '../../interfaces/ActionDelays';

import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';

import { handleCommunicationRequest } from './handleCommunicationRequest';
import { handleCommunicationResponse } from './handleCommunicationResponse';

describe('[GM] communication integration', () => {
  let communicationRequestsStore: CommunicationRequestsStore;
  let actionDelays: ActionDelays;
  let sendMessage: Function;
  let communicationRequester: Player;
  let informationSource: Player;
  let playersContainer: PlayersContainer;

  beforeEach(() => {
    communicationRequestsStore = new CommunicationRequestsStore();
    actionDelays = <any>{
      communicationAccept: 2000,
      communicationRequest: 3000
    };
    sendMessage = jest.fn();

    communicationRequester = new Player();
    communicationRequester.playerId = 'requester';
    communicationRequester.isLeader = false;

    informationSource = new Player();
    informationSource.playerId = 'source';
    informationSource.isLeader = false;

    playersContainer = new PlayersContainer();
    playersContainer.addPlayer(communicationRequester);
    playersContainer.addPlayer(informationSource);

    jest.useFakeTimers();

    handleCommunicationRequest(
      communicationRequestsStore,
      <any>{ actionDelays, sendMessage, playersContainer },
      communicationRequester,
      {
        senderId: communicationRequester.playerId,
        type: 'COMMUNICATION_REQUEST',
        payload: {
          targetPlayerId: informationSource.playerId
        }
      }
    );
    jest.runOnlyPendingTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow the information source to accept', () => {
    const response = handleCommunicationResponse(
      communicationRequestsStore,
      <any>{
        actionDelays,
        sendMessage,
        playersContainer
      },
      informationSource,
      {
        senderId: informationSource.playerId,
        type: 'COMMUNICATION_RESPONSE',
        payload: {
          accepted: true,
          targetPlayerId: communicationRequester.playerId,
          board: <any>null
        }
      }
    );

    expect(response.valid).toBe(true);
  });

  it('should allow the information source to reject', () => {
    const response = handleCommunicationResponse(
      communicationRequestsStore,
      <any>{
        actionDelays,
        sendMessage,
        playersContainer
      },
      informationSource,
      {
        senderId: informationSource.playerId,
        type: 'COMMUNICATION_RESPONSE',
        payload: {
          accepted: false,
          targetPlayerId: communicationRequester.playerId
        }
      }
    );

    expect(response.valid).toBe(true);
  });
});
