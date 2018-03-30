import { createDelay } from '../../common/createDelay';
import { Point } from '../../common/Point';

import { DiscoveryRequest } from '../../interfaces/requests/DiscoveryRequest';
import { DiscoveryResponse, TileInfo } from '../../interfaces/responses/DiscoveryResponse';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

import { Board } from '../models/Board';

function getSurroundingTiles(playerPosition: Point, board: Board): TileInfo[] {
  const outTiles: TileInfo[] = [];
  const fromX = Math.max(0, playerPosition.x - 1);
  const fromY = Math.max(0, playerPosition.y - 1);
  const toX = Math.min(board.size.x - 1, playerPosition.x + 1);
  const toY = Math.min(board.size.goalArea * 2 + board.size.taskArea - 1, playerPosition.y + 1);

  for (let x = fromX; x <= toX; x++) {
    for (let y = fromY; y <= toY; y++) {
      const tile = board.getTileAtPosition(new Point(x, y));
      outTiles.push({
        x: x,
        y: y,
        playerId: tile.player ? tile.player.playerId : null,
        piece: !!tile.piece,
        distanceToClosestPiece: board.getDistanceToClosestPiece(new Point(tile.x, tile.y))
      });
    }
  }

  return outTiles;
}

export function handleDiscoveryRequest(
  { board, actionDelays }: MessageHandlerDependencies,
  sender: Player,
  _discoveryRequest: DiscoveryRequest
): ProcessMessageResult<DiscoveryResponse> {
  const playerPosition = sender.position;
  if (!playerPosition) {
    return {
      valid: false,
      reason: 'Invalid player position. Something is wrong with GM'
    };
  }

  const responsePromise = createDelay(actionDelays.discover).then((): DiscoveryResponse => ({
    type: 'DISCOVERY_RESPONSE',
    payload: {
      timestamp: Date.now(),
      tiles: getSurroundingTiles(playerPosition, board)
    },
    recipientId: sender.playerId,
    senderId: -1
  }));

  return {
    valid: true,
    delay: actionDelays.discover,
    responseMessage: responsePromise
  };
}
