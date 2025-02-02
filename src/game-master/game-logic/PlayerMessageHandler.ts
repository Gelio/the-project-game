import { REQUEST_TYPE } from '../../common/REQUEST_TYPE';

import { Message } from '../../interfaces/Message';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { handleCommunicationRequest } from './handleCommunicationRequest';
import { handleCommunicationResponse } from './handleCommunicationResponse';
import { handleDeletePieceRequest } from './handleDeletePieceRequest';
import { handleDiscoveryRequest } from './handleDiscoveryRequest';
import { handleMoveRequest } from './handleMoveRequest';
import { handlePickUpPieceRequest } from './handlePickUpPieceRequest';
import { handlePlaceDownPieceRequest } from './handlePlaceDownPieceRequest';
import { handleRefreshStateRequest } from './handleRefreshStateRequest';
import { handleTestPieceRequest } from './handleTestPieceRequest';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

import { CommunicationRequestsStore } from '../communication/CommunicationRequestsStore';

export class PlayerMessageHandler {
  private readonly dependencies: MessageHandlerDependencies;
  private readonly communicationRequestsStore: CommunicationRequestsStore;

  private readonly handlerMap: { [requestType: string]: Function } = {
    [REQUEST_TYPE.DELETE_PIECE_REQUEST]: handleDeletePieceRequest,
    [REQUEST_TYPE.DISCOVERY_REQUEST]: handleDiscoveryRequest,
    [REQUEST_TYPE.MOVE_REQUEST]: handleMoveRequest,
    [REQUEST_TYPE.PICK_UP_PIECE_REQUEST]: handlePickUpPieceRequest,
    [REQUEST_TYPE.PLACE_DOWN_PIECE_REQUEST]: handlePlaceDownPieceRequest,
    [REQUEST_TYPE.REFRESH_STATE_REQUEST]: handleRefreshStateRequest,
    [REQUEST_TYPE.TEST_PIECE_REQUEST]: handleTestPieceRequest
  };

  constructor(
    dependencies: MessageHandlerDependencies,
    communicationRequestsStore: CommunicationRequestsStore
  ) {
    this.dependencies = dependencies;
    this.communicationRequestsStore = communicationRequestsStore;

    this.handlerMap[REQUEST_TYPE.COMMUNICATION_RESPONSE] = handleCommunicationResponse.bind(
      null,
      this.communicationRequestsStore
    );
    this.handlerMap[REQUEST_TYPE.COMMUNICATION_REQUEST] = handleCommunicationRequest.bind(
      null,
      this.communicationRequestsStore
    );
  }

  public handleMessage(sender: Player, message: Message<any>): ProcessMessageResult<any> {
    const handler = this.handlerMap[message.type];

    if (!handler) {
      return {
        valid: false,
        reason: `Unknown message type: ${message.type}`
      };
    }

    return handler(this.dependencies, sender, message);
  }
}
