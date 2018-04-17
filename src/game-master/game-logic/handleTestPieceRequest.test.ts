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
    player.playerId = 'player2';
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

  it('should correctly test piece when piece is a sham', async () => {
    const result = executeTestPieceRequest();
    jest.advanceTimersByTime(actionDelays.test);

    const { payload } = await result.responseMessage;

    expect(payload.isSham).toBe(true);
  });

  it('should correctly test piece when piece is not a sham', async () => {
    piece.isSham = false;
    const result = executeTestPieceRequest();
    jest.advanceTimersByTime(actionDelays.test);

    const { payload } = await result.responseMessage;

    expect(payload.isSham).toBe(false);
  });

  it('should not remove piece from player', async () => {
    executeTestPieceRequest();
    jest.advanceTimersByTime(actionDelays.test);

    expect(player.heldPiece).toBe(piece);
  });

  it('should be valid', () => {
    const result = executeTestPieceRequest();

    expect(result.valid).toBe(true);
  });

  it('should mark action as invalid when player does not hold a piece', () => {
    player.heldPiece = null;
    piece.isPickedUp = false;
    board.getTileAtPosition(piece.position).piece = piece;

    const result = executeTestPieceRequest();

    expect(result.valid).toBe(false);
  });

  it('should resolve the response after action delay', () => {
    const result: ValidMessageResult<TestPieceResponse> = <any>executeTestPieceRequest();

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe('player2');
    });

    jest.advanceTimersByTime(actionDelays.test);
    expect.assertions(1);
  });

  it('should not resolve the message before the delay', () => {
    const result = executeTestPieceRequest();
    let resolved = false;

    result.responseMessage.then(() => {
      resolved = true;
    });
    jest.advanceTimersByTime(actionDelays.test - 1);

    expect(resolved).toBe(false);
  });
});
