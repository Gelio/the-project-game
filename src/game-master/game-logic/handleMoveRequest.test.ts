import { LoggerInstance } from 'winston';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { Direction } from '../../interfaces/Direction';
import { MoveResponse } from '../../interfaces/responses/MoveResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import { Scoreboard } from '../models/Scoreboard';

import { Player } from '../Player';
import { ValidMessageResult } from '../ProcessMessageResult';

import { handleMoveRequest } from './handleMoveRequest';

const TIMESTAMP_DIFFERENCE_THRESHOLD = 5;

describe('[GM] handleMoveRequest', () => {
  let board: Board;
  let actionDelays: ActionDelays;
  let player: Player;
  let logger: LoggerInstance;
  let scoreBoard: Scoreboard;

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
      move: 500
    };

    scoreBoard = new Scoreboard(10);

    player = new Player();
    player.isBusy = true;
    player.playerId = 'player1';
    board.addPlayer(player);
    if (player.position) {
      const oldPlayerPosition = player.position;
      board.getTileAtPosition(oldPlayerPosition).player = null;
    }
    player.position = new Point(5, 15);
    board.getTileAtPosition(player.position).player = player;

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();
  });

  function executeHandler(direction: Direction): ValidMessageResult<MoveResponse> {
    return <any>handleMoveRequest(
      {
        board,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger,
        scoreboard: scoreBoard
      },
      player,
      {
        senderId: 'player1',
        payload: {
          direction: direction
        },
        type: 'MOVE_REQUEST'
      }
    );
  }

  it('should always be valid', () => {
    const result = executeHandler(Direction.Down);

    expect(result.valid).toBe(true);
  });

  it('should return the response after delay', () => {
    jest.useFakeTimers();

    const result = executeHandler(Direction.Down);
    expect(result.delay).toBe(actionDelays.move);

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe(player.playerId);
    });

    expect.assertions(2);
    jest.advanceTimersByTime(actionDelays.move);

    jest.useRealTimers();
  });

  describe('response', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should contain current timestamp', async () => {
      const result = executeHandler(Direction.Down);
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;
      expect(Math.abs(payload.timestamp - Date.now())).toBeLessThanOrEqual(
        TIMESTAMP_DIFFERENCE_THRESHOLD
      );
    });

    it('should move player down', async () => {
      const result = executeHandler(Direction.Down);
      jest.advanceTimersByTime(actionDelays.move);

      await result.responseMessage;

      if (!player.position) {
        throw new Error('Internal error, player position is not defined');
      }

      expect(player.position.x).toBe(5);
      expect(player.position.y).toBe(16);
    });

    it('should move player up', async () => {
      const result = executeHandler(Direction.Up);
      jest.advanceTimersByTime(actionDelays.move);

      await result.responseMessage;

      if (!player.position) {
        throw new Error('Internal error, player position is not defined');
      }
      expect(player.position.x).toBe(5);
      expect(player.position.y).toBe(14);
    });

    it('should move player right', async () => {
      const result = executeHandler(Direction.Right);
      jest.advanceTimersByTime(actionDelays.move);

      await result.responseMessage;

      if (!player.position) {
        throw new Error('Internal error, player position is not defined');
      }

      expect(player.position.x).toBe(6);
      expect(player.position.y).toBe(15);
    });

    it('should move player left', async () => {
      const result = executeHandler(Direction.Left);
      jest.advanceTimersByTime(actionDelays.move);

      await result.responseMessage;

      if (!player.position) {
        throw new Error('Internal error, player position is not defined');
      }

      expect(player.position.x).toBe(4);
      expect(player.position.y).toBe(15);
    });

    it('should contain distance to closest piece', async () => {
      const result = executeHandler(Direction.Down);
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;
      expect(payload.distanceToPiece).toBeDefined();
    });

    it('should set distances to closest piece to -1 when there are no pieces on the board', async () => {
      const result = executeHandler(Direction.Down);
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

      const result = executeHandler(Direction.Down);
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;

      if (!player.position) {
        throw new Error('Internal error, player position is not defined');
      }

      expect(payload.distanceToPiece).toBe(board.getDistanceToClosestPiece(player.position));
    });
  });
});
