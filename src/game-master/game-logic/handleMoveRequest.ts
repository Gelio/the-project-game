import { createDelay } from '../../common/createDelay';
import { Point } from '../../common/Point';

import { MoveRequest } from '../../interfaces/requests/MoveRequest';
import { MoveResponse } from '../../interfaces/responses/MoveResponse';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { MessageHandlerDependencies } from './MessageHandlerDependencies';

import { Direction } from '../../interfaces/Direction';
import { Board } from '../models/Board';

export function handleMoveRequest(
  { board, actionDelays }: MessageHandlerDependencies,
  sender: Player,
  _moveRequest: MoveRequest
): ProcessMessageResult<MoveResponse> {
  const playerPosition = sender.position;
  if (!playerPosition) {
    return {
      valid: false,
      reason: 'Invalid player position. Something is wrong with GM'
    };
  }

  let newPosition: Point;

  switch (_moveRequest.payload.direction) {
    case Direction.Down: {
      newPosition = new Point(sender.position.x, sender.position.y + 1);
      break;
    }
    case Direction.Up: {
      newPosition = new Point(sender.position.x, sender.position.y - 1);
      break;
    }
    case Direction.Left: {
      newPosition = new Point(sender.position.x - 1, sender.position.y);
      break;
    }
    case Direction.Right: {
      newPosition = new Point(sender.position.x + 1, sender.position.y);
      break;
    }
    default:
  }
  try {
    board.movePlayer(sender, newPosition);
  } catch (error) {
    return {
      valid: false,
      reason: error
    };
  }
  const responsePromise = createDelay(actionDelays.move).then((): MoveResponse => ({
    type: 'MOVE_RESPONSE',
    payload: {
      timestamp: Date.now(),
      distanceToPiece: board.getDistanceToClosestPiece(newPosition)
    },
    recipientId: sender.playerId,
    senderId: -1
  }));

  return {
    valid: true,
    delay: actionDelays.move,
    responseMessage: responsePromise
  };
}
