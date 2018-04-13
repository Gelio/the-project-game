import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { DeletePieceResponse } from '../../interfaces/responses/DeletePieceResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import { Scoreboard } from '../models/Scoreboard';

import { Player } from '../Player';
import { ValidMessageResult } from '../ProcessMessageResult';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { handleDeletePieceRequest } from './handleDeletePieceRequest';

describe('[GM] handleDeletePieceRequest', () => {
  let board: Board;
  let actionDelays: ActionDelays;
  let player: Player;
  let piece: Piece;
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
      destroy: 200
    };

    piece = new Piece();
    piece.isPickedUp = true;
    piece.position = new Point(0, 0);

    player = new Player();
    player.isBusy = true;
    player.playerId = 'player2';
    player.position = new Point(0, 0);
    player.heldPiece = piece;

    board.addPiece(piece);
    board.getTileAtPosition(piece.position).piece = null;

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();
  });

  function executeDeletePieceRequest() {
    return handleDeletePieceRequest(
      {
        board,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger,
        scoreboard: new Scoreboard(5)
      },
      player,
      <any>{}
    );
  }

  it('should delete piece from the board', () => {
    const result: ValidMessageResult<DeletePieceResponse> = <any>executeDeletePieceRequest();

    expect(result.valid).toBe(true);
    expect(player.heldPiece).toBeNull();
    expect(board.pieces).not.toContain(piece);
  });

  it('should mark move as invalid when player does not hold a piece', () => {
    player.heldPiece = null;
    piece.isPickedUp = false;
    board.getTileAtPosition(piece.position).piece = piece;

    const result = executeDeletePieceRequest();

    expect(result.valid).toBe(false);
  });

  it('should resolve the response after action delay', () => {
    jest.useFakeTimers();

    const result: ValidMessageResult<DeletePieceResponse> = <any>executeDeletePieceRequest();

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe(player.playerId);
    });

    jest.advanceTimersByTime(actionDelays.destroy);
    expect.assertions(1);

    jest.useRealTimers();
  });

  it('should not resolve the response before action delay', done => {
    jest.useFakeTimers();

    const result: ValidMessageResult<DeletePieceResponse> = <any>executeDeletePieceRequest();

    result.responseMessage.then(() => done.fail('Response resolved before action delay'));

    jest.advanceTimersByTime(actionDelays.destroy - 1);
    jest.useRealTimers();
    done();
  });
});
