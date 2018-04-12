import { PlayerPosition } from '../../interfaces/PlayerPosition';
import { RefreshStateRequest } from '../../interfaces/requests/RefreshStateRequest';
import {
  RefreshStateResponse,
  RefreshStateResponsePayload
} from '../../interfaces/responses/RefreshStateResponse';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';
import { MessageHandlerDependencies } from './MessageHandlerDependencies';

function getPlayerPosition(player: Player): PlayerPosition {
  if (!player.position) {
    throw new Error('Player position is not defined');
  }

  return {
    playerId: player.playerId,
    x: player.position.x,
    y: player.position.y
  };
}

export function handleRefreshStateRequest(
  { board, logger, playersContainer }: MessageHandlerDependencies,
  sender: Player,
  _refreshStateRequeset: RefreshStateRequest
): ProcessMessageResult<RefreshStateResponse> {
  if (!sender.position) {
    logger.error('Player position not set');

    return {
      valid: false,
      reason: 'Internal GM error'
    };
  }

  const payload: RefreshStateResponsePayload = {
    timestamp: Date.now(),
    currentPositionDistanceToClosestPiece: board.getDistanceToClosestPiece(sender.position),
    playerPositions: playersContainer.players.map(getPlayerPosition),
    // TODO: use real scores
    team1Score: 0,
    team2Score: 0
  };

  const response: RefreshStateResponse = {
    type: 'REFRESH_STATE_RESPONSE',
    payload,
    recipientId: sender.playerId,
    senderId: -1
  };

  return {
    valid: true,
    delay: 0,
    responseMessage: Promise.resolve(response)
  };
}
