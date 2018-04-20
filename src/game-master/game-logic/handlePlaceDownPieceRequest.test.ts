import { LoggerInstance } from 'winston';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { PlaceDownPieceResponse } from '../../interfaces/responses/PlaceDownPieceResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import { Scoreboard } from '../models/Scoreboard';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';

import { Player } from '../Player';
import {
  InvalidMessageResult,
  ProcessMessageResult,
  ValidMessageResult
} from '../ProcessMessageResult';

import { handlePlaceDownPieceRequest } from './handlePlaceDownPieceRequest';

function valid(
  result: ProcessMessageResult<PlaceDownPieceResponse>
): ValidMessageResult<PlaceDownPieceResponse> {
  return <any>result;
}

function invalid(result: ProcessMessageResult<PlaceDownPieceResponse>): InvalidMessageResult {
  return <any>result;
}

describe('[GM] handlePlaceDownPiece', () => {
  let board: Board;
  let actionDelays: ActionDelays;
  let player: Player;
  let piece: Piece;
  let scoreboard: Scoreboard;
  let logger: LoggerInstance;

  beforeEach(() => {
    board = new Board(
      {
        goalArea: 10,
        taskArea: 20,
        x: 10
      },
      10
    );

    actionDelays = <any>{
      place: 200
    };

    player = new Player();
    player.isBusy = true;
    player.playerId = 'player1';
    player.position = new Point(0, 0);

    piece = new Piece();
    piece.isPickedUp = true;
    piece.isSham = false;
    piece.position = player.position.clone();
    player.heldPiece = piece;
    board.addPiece(piece);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    scoreboard = new Scoreboard(5);

    logger = loggerFactory.createEmptyLogger();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function executeHandler(): ProcessMessageResult<PlaceDownPieceResponse> {
    return handlePlaceDownPieceRequest(
      {
        board,
        playersContainer: <any>{},
        actionDelays,
        logger,
        scoreboard,
        sendMessage: jest.fn()
      },
      player,
      <any>{}
    );
  }

  it('should mark action as invalid when player does not hold a piece', () => {
    player.heldPiece = null;
    const result = executeHandler();

    expect(result.valid).toBe(false);
    expect(invalid(result).reason).toMatchSnapshot();
  });

  it('should mark action as invalid when tile already has a piece', () => {
    board.getTileAtPosition(<Point>player.position).piece = new Piece();
    const result = executeHandler();

    expect(result.valid).toBe(false);
    expect(invalid(result).reason).toMatchSnapshot();
  });

  describe('on neutral tile', () => {
    beforeEach(() => {
      player.position = new Point(0, board.size.goalArea);
      piece.position = player.position.clone();
    });

    it('should place the piece on the board', () => {
      executeHandler();
      const tile = board.getTileAtPosition(<Point>player.position);

      expect(tile.piece).toBe(piece);
      expect(piece.isPickedUp).toBe(false);
    });

    it('should take the piece from the player', () => {
      executeHandler();

      expect(player.heldPiece).toBe(null);
    });

    it('should be valid', () => {
      const result = executeHandler();

      expect(result.valid).toBe(true);
    });

    it('should have a correct delay', () => {
      const result = executeHandler();

      expect(valid(result).delay).toBe(actionDelays.place);
    });

    it('should resolve the message after a delay', () => {
      const result = executeHandler();

      valid(result).responseMessage.then(response => {
        expect(response.recipientId).toBe(player.playerId);
      });

      expect.assertions(1);
      jest.advanceTimersByTime(actionDelays.place);
    });

    it('should mark didCompleteGoal as undefined', async () => {
      const result = executeHandler();

      jest.advanceTimersByTime(actionDelays.place);

      const response = await valid(result).responseMessage;
      expect(response.payload.didCompleteGoal).toBeUndefined();
    });

    it('should not resolve the message before the delay', () => {
      const result = executeHandler();
      let resolved = false;

      valid(result).responseMessage.then(() => {
        resolved = true;
      });
      jest.advanceTimersByTime(actionDelays.place - 1);

      expect(resolved).toBe(false);
    });

    it('should not modify team scores', () => {
      executeHandler();

      expect(scoreboard.team1Score).toBe(0);
      expect(scoreboard.team2Score).toBe(0);
    });
  });

  describe('on team area tile', () => {
    let tile: TeamAreaTile;

    beforeEach(() => {
      tile = <TeamAreaTile>board.getTileAtPosition(<Point>player.position);
    });

    it('should remove the piece from the board', () => {
      executeHandler();

      expect(board.pieces).not.toContain(piece);
    });

    it('should take the piece from the player', () => {
      executeHandler();

      expect(player.heldPiece).toBe(null);
    });

    it('should mark piece as not picked up', () => {
      executeHandler();

      expect(piece.isPickedUp).toBe(false);
    });

    it('should be valid', () => {
      const result = executeHandler();

      expect(result.valid).toBe(true);
    });

    it('should have a correct delay', () => {
      const result = executeHandler();

      expect(valid(result).delay).toBe(actionDelays.place);
    });

    it('should resolve the message after a delay', async () => {
      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.place);

      const response = await valid(result).responseMessage;
      expect(response.recipientId).toBe(player.playerId);
    });

    it('should not resolve the message before the delay', () => {
      const result = executeHandler();
      let resolved = false;

      valid(result).responseMessage.then(() => {
        resolved = true;
      });
      jest.advanceTimersByTime(actionDelays.place - 1);

      expect(resolved).toBe(false);
    });

    describe('when the piece is a sham', () => {
      beforeEach(() => {
        piece.isSham = true;
      });

      it('should mark didCompleteGoal as undefined', async () => {
        const result = executeHandler();

        jest.advanceTimersByTime(actionDelays.place);

        const response = await valid(result).responseMessage;
        expect(response.payload.didCompleteGoal).toBeUndefined();
      });
    });

    describe('when the piece is a valid piece', () => {
      describe('and tile does not have a goal', () => {
        beforeEach(() => {
          tile.hasGoal = false;
        });

        it('should mark didCompleteGoal as false', async () => {
          const result = executeHandler();

          jest.advanceTimersByTime(actionDelays.place);

          const response = await valid(result).responseMessage;
          expect(response.payload.didCompleteGoal).toBe(false);
        });
      });

      describe('and tile does have an uncompleted goal', () => {
        beforeEach(() => {
          tile.hasGoal = true;
          tile.hasCompletedGoal = false;
        });

        it('should mark didCompleteGoal as true', async () => {
          const result = executeHandler();

          jest.advanceTimersByTime(actionDelays.place);

          const response = await valid(result).responseMessage;
          expect(response.payload.didCompleteGoal).toBe(true);
        });

        it('should increase the score for team 1', () => {
          player.teamId = 1;
          executeHandler();

          expect(scoreboard.team1Score).toBe(1);
        });

        it("should not modify the other team's score", () => {
          player.teamId = 1;
          executeHandler();

          expect(scoreboard.team2Score).toBe(0);
        });

        it('should increase the score for team 2', () => {
          player.teamId = 2;
          executeHandler();

          expect(scoreboard.team2Score).toBe(1);
        });

        // TODO: add a test for a win condition
      });

      describe('and tile does have a completed goal', () => {
        beforeEach(() => {
          tile.hasGoal = true;
          tile.hasCompletedGoal = true;
        });

        it('should mark didCompleteGoal as false', async () => {
          const result = executeHandler();

          jest.advanceTimersByTime(actionDelays.place);

          const response = await valid(result).responseMessage;
          expect(response.payload.didCompleteGoal).toBe(false);
        });

        it("should not increase the team's score", () => {
          player.teamId = 1;
          executeHandler();

          expect(scoreboard.team1Score).toBe(0);
        });
      });
    });
  });
});
