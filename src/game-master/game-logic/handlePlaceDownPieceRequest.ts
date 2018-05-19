import { createDelay } from '../../common/createDelay';
import { GAME_MASTER_ID } from '../../common/EntityIds';
import { Point } from '../../common/Point';

import { PlaceDownPieceRequest } from '../../interfaces/requests/PlaceDownPieceRequest';
import { PlaceDownPieceResponse } from '../../interfaces/responses/PlaceDownPieceResponse';

import { Player } from '../Player';
import { ProcessMessageResult } from '../ProcessMessageResult';

import { Piece } from '../models/Piece';
import { NeutralAreaTile } from '../models/tiles/NeutralAreaTile';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';
import { MessageHandlerDependencies } from './MessageHandlerDependencies';

function createPlaceDownPieceResponse(
  recipientId: string,
  didCompleteGoal?: boolean
): PlaceDownPieceResponse {
  return {
    type: 'PLACE_DOWN_PIECE_RESPONSE',
    payload: {
      didCompleteGoal
    },
    recipientId: recipientId,
    senderId: GAME_MASTER_ID
  };
}

function handlePlaceDownOnNeutralAreaTile(
  tile: NeutralAreaTile,
  player: Player,
  piece: Piece,
  playerPosition: Point,
  { actionDelays }: MessageHandlerDependencies
): ProcessMessageResult<PlaceDownPieceResponse> {
  tile.piece = piece;
  piece.isPickedUp = false;
  piece.position = playerPosition.clone();
  player.heldPiece = null;

  return {
    valid: true,
    delay: actionDelays.place,
    responseMessage: createDelay(actionDelays.place).then(() =>
      createPlaceDownPieceResponse(player.playerId, undefined)
    )
  };
}

function handlePlaceDownOnTeamAreaTile(
  tile: TeamAreaTile,
  player: Player,
  piece: Piece,
  playerPosition: Point,
  { actionDelays, board, scoreboard, logger, onPointsLimitReached }: MessageHandlerDependencies
): ProcessMessageResult<PlaceDownPieceResponse> {
  board.removePiece(piece);
  player.heldPiece = null;
  piece.isPickedUp = false;

  if (piece.isSham) {
    logger.verbose(`Player ${player.playerId} placed down a sham at ${playerPosition.toString()}`);

    return {
      valid: true,
      delay: actionDelays.place,
      responseMessage: createDelay(actionDelays.place).then(() =>
        createPlaceDownPieceResponse(player.playerId, undefined)
      )
    };
  }

  if (!tile.hasGoal) {
    logger.verbose(`Player ${player.playerId} placed down a piece at ${playerPosition.toString()}`);

    return {
      valid: true,
      delay: actionDelays.place,
      responseMessage: createDelay(actionDelays.place).then(() =>
        createPlaceDownPieceResponse(player.playerId, false)
      )
    };
  }

  if (!tile.hasCompletedGoal) {
    logger.verbose(`Player ${player.playerId} completed a goal at ${playerPosition.toString()}`);
    tile.hasCompletedGoal = true;

    if (player.teamId === 1) {
      scoreboard.team1Score++;
      if (scoreboard.team1Score === scoreboard.scoreLimit) {
        onPointsLimitReached();
      }
    } else if (player.teamId === 2) {
      scoreboard.team2Score++;
      if (scoreboard.team2Score === scoreboard.scoreLimit) {
        onPointsLimitReached();
      }
    }

    return {
      valid: true,
      delay: actionDelays.place,
      responseMessage: createDelay(actionDelays.place).then(() =>
        createPlaceDownPieceResponse(player.playerId, true)
      )
    };
  }

  logger.verbose(
    `Player ${player.playerId} placed down a piece at ${playerPosition.toString()} (completed goal)`
  );

  return {
    valid: true,
    delay: actionDelays.place,
    responseMessage: createDelay(actionDelays.place).then(() =>
      createPlaceDownPieceResponse(player.playerId, false)
    )
  };
}

export function handlePlaceDownPieceRequest(
  dependencies: MessageHandlerDependencies,
  sender: Player,
  _discoveryRequest: PlaceDownPieceRequest
): ProcessMessageResult<PlaceDownPieceResponse> {
  const { board, logger } = dependencies;
  const { position } = sender;

  if (!position) {
    logger.error('Player position not set');

    return {
      valid: false,
      reason: 'Internal GM error. Invalid player position'
    };
  }

  if (!sender.heldPiece) {
    return {
      valid: false,
      reason: 'Player does not hold a piece'
    };
  }

  const tile = board.getTileAtPosition(position);
  if (tile.piece) {
    return {
      valid: false,
      reason: 'Tile under the player already has a piece'
    };
  }

  if (tile.type === 'NeutralAreaTile') {
    return handlePlaceDownOnNeutralAreaTile(tile, sender, sender.heldPiece, position, dependencies);
  }

  if (tile.type === 'TeamAreaTile') {
    return handlePlaceDownOnTeamAreaTile(tile, sender, sender.heldPiece, position, dependencies);
  }

  logger.error(`Invalid tile type '${(<any>tile).type}' at ${position.toString()}`);

  return {
    valid: false,
    reason: 'Internal GM error. Invalid tile type'
  };
}
