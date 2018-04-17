import { LoggerInstance } from 'winston';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { Direction } from '../../interfaces/Direction';
import { MoveResponse } from '../../interfaces/responses/MoveResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import { Scoreboard } from '../models/Scoreboard';

import { config } from '../config';
import { Player } from '../Player';
import {
  InvalidMessageResult,
  ProcessMessageResult,
  ValidMessageResult
} from '../ProcessMessageResult';

import { handleMoveRequest } from './handleMoveRequest';

describe('[GM] handleMoveRequest ', () => {
  let board: Board;
  let actionDelays: ActionDelays;
  let player: Player;
  let logger: LoggerInstance;
  let scoreboard: Scoreboard;

  beforeEach(() => {
    board = new Board(
      {
        goalArea: 5,
        taskArea: 20,
        x: 10
      },
      10
    );

    actionDelays = <any>{
      move: 500
    };

    scoreboard = new Scoreboard(10);

    player = new Player();
    player.isBusy = true;
    player.playerId = 'player1';
    board.addPlayer(player);
    board.movePlayer(player, new Point(5, 15));

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function executeHandler(direction: Direction): ProcessMessageResult<MoveResponse> {
    return <any>handleMoveRequest(
      {
        board,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger,
        scoreboard
      },
      player,
      {
        senderId: 'player1',
        payload: {
          direction
        },
        type: 'MOVE_REQUEST'
      }
    );
  }

  it('should always be valid when move is valid', () => {
    const result = executeHandler(Direction.Down);

    expect(result.valid).toBe(true);
  });

  it('should reject request when move is invalid', async () => {
    board.movePlayer(player, new Point(0, 0));
    const result = executeHandler(Direction.Up);

    expect(result.valid).toBe(false);
  });

  it('should return the response after delay if move is valid', () => {
    const result = <ValidMessageResult<MoveResponse>>executeHandler(Direction.Down);

    expect(result.delay).toBe(actionDelays.move);

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe(player.playerId);
    });

    expect.assertions(2);
    jest.advanceTimersByTime(actionDelays.move);
  });

  it('should move player down', async () => {
    executeHandler(Direction.Down);

    expect((<Point>player.position).x).toBe(5);
    expect((<Point>player.position).y).toBe(16);
  });

  it('should move player up', async () => {
    executeHandler(Direction.Up);

    expect((<Point>player.position).x).toBe(5);
    expect((<Point>player.position).y).toBe(14);
  });

  it('should move player right', async () => {
    executeHandler(Direction.Right);

    expect((<Point>player.position).x).toBe(6);
    expect((<Point>player.position).y).toBe(15);
  });

  it('should move player left', async () => {
    executeHandler(Direction.Left);

    expect((<Point>player.position).x).toBe(4);
    expect((<Point>player.position).y).toBe(15);
  });

  it('should reject request when direction is invalid', () => {
    const result = executeHandler(<any>'test');

    expect(result.valid).toBe(false);
    expect((<InvalidMessageResult>result).reason).toMatchSnapshot();
  });

  it("should reject request when player tries to move into other team's area", () => {
    board.movePlayer(player, new Point(0, board.size.goalArea + board.size.taskArea));

    const result = executeHandler(Direction.Down);

    expect(result.valid).toBe(false);
    expect((<InvalidMessageResult>result).reason).toMatchSnapshot();
  });

  it("should reject request when board can't move player to new position", () => {
    player.position = new Point(6, 6);

    const result = executeHandler(Direction.Down);

    expect(result.valid).toBe(false);
    expect((<InvalidMessageResult>result).reason).toMatchSnapshot();
  });

  describe('response', () => {
    it('should contain current timestamp', async () => {
      const result = <ValidMessageResult<MoveResponse>>executeHandler(Direction.Down);
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;
      expect(Math.abs(payload.timestamp - Date.now())).toBeLessThanOrEqual(
        config.tests.timestampDifferenceThreshold
      );
    });

    it('should contain distance to closest piece', async () => {
      const piece = new Piece();

      piece.position = (<Point>player.position).clone();
      board.addPiece(piece);

      const result = <ValidMessageResult<MoveResponse>>executeHandler(Direction.Down);
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;
      expect(payload.distanceToPiece).toBe(1);
    });

    it('should have distance to the closest piece set to -1 when there are no pieces on the board', async () => {
      const result = <ValidMessageResult<MoveResponse>>executeHandler(Direction.Down);
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;

      expect(payload.distanceToPiece).toBe(-1);
    });

    it("should contain valid distances to closest piece (when it's far away)", async () => {
      const piece = new Piece();
      piece.isPickedUp = false;
      piece.isSham = true;
      piece.position = new Point(5, 5);
      board.addPiece(piece);

      const result = <ValidMessageResult<MoveResponse>>executeHandler(Direction.Down);
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;

      expect(payload.distanceToPiece).toBe(11);
    });
  });
});
