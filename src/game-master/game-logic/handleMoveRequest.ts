import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';
import { Point } from '../../common/Point';

import { MoveRequest } from '../../interfaces/requests/MoveRequest';
import { MoveResponse } from '../../interfaces/responses/MoveResponse';

import { Direction } from '../../interfaces/Direction';

import { Tile } from '../models/tiles/Tile';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

export function handleMoveRequest(
  { board, actionDelays, logger }: MessageHandlerDependencies,
  sender: Player,
  moveRequest: MoveRequest
): ProcessMessageResult<MoveResponse> {
  const playerPosition = sender.position;
  if (!playerPosition) {
    logger.error('Player position is not defined');

    return {
      valid: false,
      reason: 'Invalid player position. Something is wrong with GM'
    };
  }

  let newPosition: Point = new Point(-1, -1);

  switch (moveRequest.payload.direction) {
    case Direction.Down: {
      newPosition = new Point(playerPosition.x, playerPosition.y + 1);
      break;
    }
    case Direction.Up: {
      newPosition = new Point(playerPosition.x, playerPosition.y - 1);
      break;
    }
    case Direction.Left: {
      newPosition = new Point(playerPosition.x - 1, playerPosition.y);
      break;
    }
    case Direction.Right: {
      newPosition = new Point(playerPosition.x + 1, playerPosition.y);
      break;
    }
    default: {
      return {
        valid: false,
        reason: 'Invalid direction.'
      };
    }
  }

  let newTile: Tile;
  try {
    newTile = board.getTileAtPosition(newPosition);
  } catch {
    return {
      valid: false,
      reason: `Can't move player ${
        moveRequest.payload.direction
      }. Requested move exceeds map borders.`
    };
  }

  if (newTile.type === 'TeamAreaTile') {
    if (board.getTileTeamId(newTile) !== sender.teamId) {
      return {
        valid: false,
        reason: `Can't move player ${
          moveRequest.payload.direction
        }. Only team members are allowed to enter team area.`
      };
    }
  }

  try {
    board.movePlayer(sender, newPosition);
  } catch (error) {
    return {
      valid: false,
      reason: `Can't move player ${moveRequest.payload.direction}. Error: ${error.message}`
    };
  }

  if (sender.heldPiece) {
    sender.heldPiece.position = newPosition;
  }

  const responsePromise = createDelay(actionDelays.move).then((): MoveResponse => ({
    type: 'MOVE_RESPONSE',
    payload: {
      timestamp: Date.now(),
      distanceToPiece: board.getDistanceToClosestPiece(newPosition)
    },
    recipientId: sender.playerId,
    senderId: GAME_MASTER_ID
  }));

  return {
    valid: true,
    delay: actionDelays.move,
    responseMessage: responsePromise
  };
}
