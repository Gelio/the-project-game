import { LoggerInstance } from 'winston';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { MoveResponse } from '../../interfaces/responses/MoveResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';

import { Player } from '../Player';
import { ValidMessageResult } from '../ProcessMessageResult';

import { handleMoveRequest } from './handleMoveRequest';
import { MoveRequest } from '../../interfaces/requests/MoveRequest';
import { Direction } from '../../interfaces/Direction';

const TIMESTAMP_DIFFERENCE_THRESHOLD = 5;

describe('[GM] handleMoveRequest', () => {
  let board: Board;
  let actionDelays: ActionDelays;
  let player: Player;
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
      move: 500
    };

    player = new Player();
    player.isBusy = true;
    player.playerId = 1;
    player.position = new Point(5, 15);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();
  });

  function executeHandler(): ValidMessageResult<MoveResponse> {
    return <any>handleMoveRequest(
      {
        board,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger
      },
      player,
      {
        senderId: 1,
        payload: {
          direction: Direction.Down
        },
        type: 'MOVE_REQUEST'
      }
    );
  }

  it('should always be valid', () => {
    const result = executeHandler();

    expect(result.valid).toBe(true);
  });

  it('should return the response after delay', () => {
    jest.useFakeTimers();

    const result = executeHandler();
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
      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;
      expect(Math.abs(payload.timestamp - Date.now())).toBeLessThanOrEqual(
        TIMESTAMP_DIFFERENCE_THRESHOLD
      );
    });

    it('should contain distance to closest piece', async () => {
      player.position = new Point(1, 1);
      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;
      expect(payload.distanceToPiece).toBeDefined();
    });

    it('should set distances to closest piece to -1 when there are no pieces on the board', async () => {
      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;

      expect(payload.distanceToPiece).toBe(-1);
    });

    it("should contain valid distances to closest piece (when it's far away)", async () => {
      player.position = new Point(0, 0);

      const piece = new Piece();
      piece.isPickedUp = false;
      piece.isSham = true;
      piece.position = new Point(5, 5);
      board.addPiece(piece);

      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.move);

      const { payload } = await result.responseMessage;
      const newPlayerPosition = new Point(player.position.x, player.position.y + 1);
      expect(payload.distanceToPiece).toBe(board.getDistanceToClosestPiece(newPlayerPosition));
    });
  });
});
