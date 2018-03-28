import { createDelay } from '../../common/createDelay';
import { Point } from '../../common/Point';

import { DiscoveryRequest } from '../../interfaces/requests/DiscoveryRequest';
import { DiscoveryResponse, TileInfo } from '../../interfaces/responses/DiscoveryResponse';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';

function getDistanceToClosestPiece(tilePosition: Point, pieces: Piece[]): number {
  if (pieces.length === 0) {
    return -1;
  }
  let minDistance: number = Infinity;
  for (const p of pieces) {
    const distance = Point.manhattanDistance(tilePosition, p.position);
    if (minDistance > distance) {
      minDistance = distance;
    }
  }

  return minDistance;
}

function getCorrectTiles(playerPosition: Point, board: Board): TileInfo[] {
  const outTiles: TileInfo[] = [];
  const fromX = Math.max(0, playerPosition.x - 1);
  const fromY = Math.max(0, playerPosition.y - 1);
  const toX = Math.min(board.size.x - 1, playerPosition.x + 1);
  const toY = Math.min(board.size.goalArea * 2 + board.size.taskArea - 1, playerPosition.y + 1);

  for (let i = fromX; i <= toX; i++) {
    for (let j = fromY; j <= toY; j++) {
      const tile = board.getTileAtPosition({ x: i, y: j });
      outTiles.push({
        x: i,
        y: j,
        playerId: tile.player === null ? null : tile.player.playerId,
        piece: tile.piece === null ? false : true,
        distanceToClosestPiece: getDistanceToClosestPiece({ x: tile.x, y: tile.y }, board.pieces)
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
  if (!sender.position) {
    return {
      valid: false,
      reason: 'Invalid player position. Something is wrong with GM'
    };
  }

  const playerPosition = sender.position;

  const responsePromise = createDelay(actionDelays.destroy).then((): DiscoveryResponse => ({
    type: 'DISCOVERY_RESPONSE',
    payload: {
      timestamp: Date.now(),
      tiles: getCorrectTiles(playerPosition, board)
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
