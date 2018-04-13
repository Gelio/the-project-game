import { LoggerFactory } from '../common/logging/LoggerFactory';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';

import { DiscoveryRequest } from '../interfaces/requests/DiscoveryRequest';

import { createBlessedScreen } from '../createBlessedScreen';
import { Game } from './Game';
import { PlayersContainer } from './PlayersContainer';
import { InvalidMessageResult, ProcessMessageResult } from './ProcessMessageResult';

import { UIController } from './ui/UIController';

import { LoggerInstance } from 'winston';
import { Player } from './Player';

describe('[GM] Game', () => {
  const boardSize: BoardSize = {
    x: 30,
    goalArea: 50,
    taskArea: 300
  };
  let game: Game;
  let uiController: UIController;
  let loggerInstance: LoggerInstance;

  const actionDelays: ActionDelays = {
    communicationAccept: 4000,
    communicationRequest: 4000,
    destroy: 4000,
    discover: 4000,
    move: 4000,
    pick: 4000,
    test: 4000,
    tryPiece: 4000
  };

  let player: Player;

  beforeAll(() => {
    const loggerFactory = new LoggerFactory();
    loggerInstance = loggerFactory.createEmptyLogger();

    const screen = createBlessedScreen();
    uiController = new UIController(screen);
  });

  beforeEach(() => {
    const playersContainter = new PlayersContainer();
    const pointsLimit = 5;
    game = new Game(
      boardSize,
      pointsLimit,
      loggerInstance,
      uiController,
      playersContainter,
      actionDelays
    );

    player = new Player();
    player.playerId = game.getNextPlayerId();
    player.teamId = 1;
    player.isLeader = true;
    player.isBusy = false;
    player.isConnected = true;
  });

  it('should generate player id starting from 1', () => {
    expect(player.playerId).toEqual(1);
  });

  describe('processMessage', () => {
    it('should reject message from non existing player', () => {
      const message: DiscoveryRequest = {
        senderId: 3,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult: ProcessMessageResult<any> = game.processMessage(message);
      expect(processedMessageResult.valid).toBeFalsy();

      const invalidResult = <InvalidMessageResult>processedMessageResult;
      expect(invalidResult).toBeDefined();
      expect(invalidResult.reason).toBe('Sender ID is invalid');
    });

    it('should reject message from busy player', () => {
      game.addPlayer(player);

      player.isBusy = true;

      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult: ProcessMessageResult<any> = game.processMessage(message);
      expect(processedMessageResult.valid).toBeFalsy();

      const invalidResult = <InvalidMessageResult>processedMessageResult;
      expect(invalidResult).toBeDefined();
      expect(invalidResult.reason).toBe('Sender is busy');
    });

    it('should process valid request', () => {
      player.playerId = game.getNextPlayerId();
      game.addPlayer(player);

      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult: ProcessMessageResult<any> = game.processMessage(message);
      expect(processedMessageResult.valid).toBeTruthy();
    });
  });

  it('should start the game', () => {
    game.start();
    expect(game.hasStarted).toBeTruthy();
  });

  it('should stop the game', () => {
    game.stop();
    expect(game.hasStarted).toBeFalsy();
  });

  it('should reset the game, players should receive new positions', () => {
    game.addPlayer(player);
    const oldPosition = player.position;

    game.reset();

    expect(player.position).not.toBe(oldPosition);
  });

  it('should add player to the game', () => {
    game.addPlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toEqual(player);
  });

  it('should remove player from the game', () => {
    game.addPlayer(player);

    game.removePlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBeNull();
  });
});
