import { LoggerInstance } from 'winston';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { Point } from '../../common/Point';

import { ActionDelays } from '../../interfaces/ActionDelays';
import { DiscoveryResponse, TileInfo } from '../../interfaces/responses/DiscoveryResponse';

import { Board } from '../models/Board';
import { Piece } from '../models/Piece';

import { Player } from '../Player';
import { ValidMessageResult } from '../ProcessMessageResult';

import { handleDiscoveryRequest } from './handleDiscoveryRequest';

describe('[GM] handleDiscoveryRequest', () => {
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
      discover: 200
    };

    player = new Player();
    player.isBusy = true;
    player.playerId = 1;
    player.position = new Point(0, 0);

    const loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';

    logger = loggerFactory.createEmptyLogger();
  });

  function executeHandler(): ValidMessageResult<DiscoveryResponse> {
    return <any>handleDiscoveryRequest(
      {
        board,
        playersContainer: <any>{},
        actionDelays: <any>actionDelays,
        logger
      },
      player,
      <any>{}
    );
  }

  function getTileInfo(tiles: TileInfo[], x: number, y: number): TileInfo {
    return <any>tiles.find(tile => tile.x === x && tile.y === y);
  }

  it('should always be valid', () => {
    const result = executeHandler();

    expect(result.valid).toBe(true);
  });

  it('should return the response after delay', () => {
    jest.useFakeTimers();

    const result = executeHandler();
    expect(result.delay).toBe(actionDelays.discover);

    result.responseMessage.then(response => {
      expect(response.recipientId).toBe(player.playerId);
    });

    expect.assertions(2);
    jest.advanceTimersByTime(actionDelays.discover);

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
      jest.advanceTimersByTime(actionDelays.discover);

      const { payload } = await result.responseMessage;
      expect(payload.timestamp).toBe(Date.now());
    });

    it('should contain 9 nearby fields', async () => {
      player.position = new Point(1, 1);
      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.discover);

      const { payload } = await result.responseMessage;
      expect(payload.tiles).toHaveLength(9);

      for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
          const foundTiles = payload.tiles.filter(tile => tile.x === x && tile.y === y);
          expect(foundTiles).toHaveLength(1);
        }
      }
    });

    it('should contain 4 nearby fields when player is in the upper left corner', async () => {
      player.position = new Point(0, 0);
      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.discover);

      const { payload } = await result.responseMessage;
      expect(payload.tiles).toHaveLength(4);

      for (let x = 0; x <= 1; x++) {
        for (let y = 0; y <= 1; y++) {
          const foundTiles = payload.tiles.filter(tile => tile.x === x && tile.y === y);
          expect(foundTiles).toHaveLength(1);
        }
      }
    });

    // TODO: create tests similar to the one above for 3 other corners

    it('should list player ids inside fields', async () => {
      player.position = new Point(0, 0);

      const player2 = new Player();
      player2.playerId = 2;
      board.addPlayer(player2);
      board.movePlayer(player2, new Point(1, 1));

      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.discover);

      const { payload } = await result.responseMessage;
      const foundTile = getTileInfo(payload.tiles, 1, 1);

      expect(foundTile.playerId).toBe(2);
    });

    it('should list pieces inside fields', async () => {
      player.position = new Point(0, 0);

      const piece = new Piece();
      piece.isPickedUp = false;
      piece.isSham = true;
      piece.position = new Point(1, 1);
      board.addPiece(piece);

      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.discover);

      const { payload } = await result.responseMessage;
      const foundTile = getTileInfo(payload.tiles, 1, 1);

      expect(foundTile.piece).toBe(true);
    });

    it('should set distances to closest piece to -1 when there are no pieces on the board', async () => {
      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.discover);

      const { payload } = await result.responseMessage;

      payload.tiles.forEach(tile => expect(tile.distanceToClosestPiece).toBe(-1));
    });

    it("should contain valid distances to closest piece (when it's nearby)", async () => {
      player.position = new Point(0, 0);

      const piece = new Piece();
      piece.isPickedUp = false;
      piece.isSham = true;
      piece.position = new Point(1, 1);
      board.addPiece(piece);

      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.discover);

      const { payload } = await result.responseMessage;
      expect(getTileInfo(payload.tiles, 0, 0).distanceToClosestPiece).toBe(2);
      expect(getTileInfo(payload.tiles, 0, 1).distanceToClosestPiece).toBe(1);
      expect(getTileInfo(payload.tiles, 1, 0).distanceToClosestPiece).toBe(1);
      expect(getTileInfo(payload.tiles, 1, 1).distanceToClosestPiece).toBe(0);
    });

    it("should contain valid distances to closest piece (when it's far away)", async () => {
      player.position = new Point(0, 0);

      const piece = new Piece();
      piece.isPickedUp = false;
      piece.isSham = true;
      piece.position = new Point(5, 5);
      board.addPiece(piece);

      const result = executeHandler();
      jest.advanceTimersByTime(actionDelays.discover);

      const { payload } = await result.responseMessage;
      expect(getTileInfo(payload.tiles, 0, 0).distanceToClosestPiece).toBe(10);
      expect(getTileInfo(payload.tiles, 0, 1).distanceToClosestPiece).toBe(9);
      expect(getTileInfo(payload.tiles, 1, 0).distanceToClosestPiece).toBe(9);
      expect(getTileInfo(payload.tiles, 1, 1).distanceToClosestPiece).toBe(8);
    });
  });
});
