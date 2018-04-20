import { LoggerInstance } from 'winston';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { PickUpPieceResponse } from '../../interfaces/responses/PickUpPieceResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import { Scoreboard } from '../models/Scoreboard';

import { Player } from '../Player';
import { ValidMessageResult } from '../ProcessMessageResult';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { handlePickUpPieceRequest } from './handlePickUpPieceRequest';

describe('[GM] handlePickUpPieceRequest', () => {
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
      pick: 100
    };

    piece = new Piece();
    piece.isPickedUp = false;
    piece.position = new Point(0, 0);

    player = new Player();
    player.isBusy = true;
    player.playerId = 'player2';
    player.position = new Point(0, 0);
    player.heldPiece = null;

    board.addPiece(piece);
    board.getTileAtPosition(piece.position).piece = piece;

    scoreboard = new Scoreboard(5);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function executePickUpPieceRequest() {
    return handlePickUpPieceRequest(
      {
        board,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger,
        scoreboard,
        sendMessage: jest.fn()
      },
      player,
      <any>{}
    );
  }

  it('should be valid', () => {
    const result = executePickUpPieceRequest();

    expect(result.valid).toBe(true);
  });

  it('should mark piece as picked up', () => {
    executePickUpPieceRequest();

    expect(piece.isPickedUp).toBe(true);
  });

  it('should not delete the piece from the board', () => {
    executePickUpPieceRequest();

    expect(board.pieces).toContain(piece);
  });

  it('should make the player hold the piece', () => {
    executePickUpPieceRequest();

    expect(player.heldPiece).toBe(piece);
  });

  it('should remove the piece from the tile', () => {
    const playerPosition = player.position;

    executePickUpPieceRequest();

    expect(board.getTileAtPosition(<Point>playerPosition).piece).toBe(null);
  });

  it('should mark action as invalid when player does hold a piece', () => {
    player.heldPiece = piece;

    const result = executePickUpPieceRequest();

    expect(result.valid).toBe(false);
  });

  it('should mark action as invalid when there is no piece to pick up', () => {
    board.getTileAtPosition(piece.position).piece = null;
    piece.position = new Point(0, 1);
    board.getTileAtPosition(piece.position).piece = piece;

    const result = executePickUpPieceRequest();

    expect(result.valid).toBe(false);
  });

  it('should mark action as invalid when player has invalid position', () => {
    player.position = null;

    const result = executePickUpPieceRequest();

    expect(result.valid).toBe(false);
  });

  it('should resolve the response after action delay', () => {
    const result: ValidMessageResult<PickUpPieceResponse> = <any>executePickUpPieceRequest();

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe('player2');
    });

    jest.advanceTimersByTime(actionDelays.pick);
    expect.assertions(1);
  });

  it('should not resolve the response before action delay', () => {
    const result = <any>executePickUpPieceRequest();
    let resolved = false;

    result.responseMessage.then(() => {
      resolved = true;
    });
    jest.advanceTimersByTime(actionDelays.pick - 1);

    expect(resolved).toBe(false);
  });
});
