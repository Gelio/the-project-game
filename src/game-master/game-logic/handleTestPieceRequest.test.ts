import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { TestPieceResponse } from '../../interfaces/responses/TestPieceResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import { Scoreboard } from '../models/Scoreboard';

import { Player } from '../Player';
import { ValidMessageResult } from '../ProcessMessageResult';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { handleTestPieceRequest } from './handleTestPieceRequest';

describe('[GM] handleTestPieceRequest', () => {
  let board: Board;
  let actionDelays: ActionDelays;
  let player: Player;
  let piece: Piece;
  let logger: LoggerInstance;
  let scoreboard: Scoreboard;

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
      test: 50
    };

    piece = new Piece();
    piece.isPickedUp = true;
    piece.isSham = true;
    piece.position = new Point(0, 0);

    player = new Player();
    player.isBusy = true;
    player.playerId = 2;
    player.position = new Point(0, 0);
    player.heldPiece = piece;

    board.addPiece(piece);
    board.getTileAtPosition(piece.position).piece = null;

    scoreboard = new Scoreboard(5);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function executeTestPieceRequest(): ValidMessageResult<TestPieceResponse> {
    return <any>handleTestPieceRequest(
      {
        board,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger,
        scoreboard
      },
      player,
      <any>{}
    );
  }

  it('should correctly test piece', async () => {
    const result = executeTestPieceRequest();
    jest.advanceTimersByTime(actionDelays.test);

    const { payload } = await result.responseMessage;

    expect(result.valid).toBe(true);
    expect(payload.isSham).toBe(true);
    expect(player.heldPiece).toBe(piece);
  });

  it('should mark action as invalid when player does not hold a piece', () => {
    player.heldPiece = null;
    piece.isPickedUp = false;
    board.getTileAtPosition(piece.position).piece = piece;

    const result = executeTestPieceRequest();
    jest.advanceTimersByTime(actionDelays.test);

    expect(result.valid).toBe(false);
  });

  it('should resolve the response after action delay', () => {
    const result: ValidMessageResult<TestPieceResponse> = <any>executeTestPieceRequest();

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe(2);
    });

    jest.advanceTimersByTime(actionDelays.test);
    expect.assertions(1);
  });

  it('should not resolve the response before action delay', done => {
    const result: ValidMessageResult<TestPieceResponse> = <any>executeTestPieceRequest();

    result.responseMessage.then(() => done.fail('Response resolved before action delay'));

    jest.advanceTimersByTime(actionDelays.test - 1);
    done();
  });
});
