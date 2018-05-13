import { LoggerInstance } from 'winston';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { RefreshStateResponse } from '../../interfaces/responses/RefreshStateResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';
import { Scoreboard } from '../models/Scoreboard';

import { config } from '../config';
import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';
import { ValidMessageResult } from '../ProcessMessageResult';

import { handleRefreshStateRequest } from './handleRefreshStateRequest';

describe('[GM] handleRefreshStateRequest', () => {
  let board: Board;
  let actionDelays: ActionDelays;
  let player: Player;
  let logger: LoggerInstance;
  let playersContainer: PlayersContainer;

  beforeEach(() => {
    board = new Board(
      {
        goalArea: 10,
        taskArea: 20,
        x: 10
      },
      10
    );

    actionDelays = <any>{};

    player = new Player();
    player.isBusy = true;
    player.playerId = 'player1';
    board.addPlayer(player);

    playersContainer = new PlayersContainer();
    playersContainer.addPlayer(player);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();
  });

  function executeHandler(): ValidMessageResult<RefreshStateResponse> {
    return <any>handleRefreshStateRequest(
      {
        board,
        playersContainer,
        actionDelays: <any>actionDelays,
        logger,
        scoreboard: new Scoreboard(5),
        sendMessage: jest.fn(),
        onPointsLimitReached: jest.fn()
      },
      player,
      <any>{}
    );
  }

  it('should always be valid', () => {
    const result = executeHandler();

    expect(result.valid).toBe(true);
  });

  it('should have no delay', () => {
    const result = executeHandler();

    expect(result.delay).toBe(0);
  });

  it('should return the response after delay', () => {
    jest.useFakeTimers();

    const result = executeHandler();

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe(player.playerId);
    });

    expect.assertions(1);
    jest.advanceTimersByTime(0);

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

      jest.advanceTimersByTime(0);

      const { payload } = await result.responseMessage;
      expect(Math.abs(payload.timestamp - Date.now())).toBeLessThanOrEqual(
        config.tests.timestampDifferenceThreshold
      );
    });

    it('should contain valid distance to closest piece', async () => {
      board.movePlayer(player, new Point(2, 10));

      const piece = new Piece();
      piece.isPickedUp = false;
      piece.isSham = true;
      piece.position = new Point(0, 10);
      board.addPiece(piece);

      const result = executeHandler();

      jest.advanceTimersByTime(0);

      const { payload } = await result.responseMessage;
      expect(payload.currentPositionDistanceToClosestPiece).toBe(2);
    });

    it('should contain other players positions', async () => {
      const player1 = new Player();
      player1.playerId = 'player2';
      player1.position = new Point(5, 5);

      const player2 = new Player();
      player2.playerId = 'player3';
      player2.position = new Point(3, 8);

      const player3 = new Player();
      player3.playerId = 'player4';
      player3.position = new Point(1, 9);

      playersContainer.addPlayer(player1);
      playersContainer.addPlayer(player2);
      playersContainer.addPlayer(player3);

      const result = executeHandler();
      jest.advanceTimersByTime(0);

      const { payload } = await result.responseMessage;

      expect(payload.playerPositions).toContainEqual({
        playerId: player1.playerId,
        x: player1.position.x,
        y: player1.position.y
      });

      expect(payload.playerPositions).toContainEqual({
        playerId: player2.playerId,
        x: player2.position.x,
        y: player2.position.y
      });

      expect(payload.playerPositions).toContainEqual({
        playerId: player3.playerId,
        x: player3.position.x,
        y: player3.position.y
      });
    });

    it('should include the sender in player positions', async () => {
      const result = executeHandler();
      jest.advanceTimersByTime(0);

      const { payload } = await result.responseMessage;

      expect(payload.playerPositions).toHaveLength(1);
      expect(payload.playerPositions).toContainEqual({
        playerId: player.playerId,
        x: (<Point>player.position).x,
        y: (<Point>player.position).y
      });
    });

    it('should include team 1 score', async () => {
      const result = executeHandler();
      jest.advanceTimersByTime(0);

      const { payload } = await result.responseMessage;
      expect(payload.team1Score).toBe(0);
    });

    it('should include team 2 score', async () => {
      const result = executeHandler();
      jest.advanceTimersByTime(0);

      const { payload } = await result.responseMessage;
      expect(payload.team2Score).toBe(0);
    });
  });
});
