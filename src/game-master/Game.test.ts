import { LoggerInstance } from 'winston';

import { LoggerFactory } from '../common/logging/LoggerFactory';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';

import { DiscoveryRequest } from '../interfaces/requests/DiscoveryRequest';

import { Game } from './Game';
import { GameState } from './GameState';
import { Player } from './Player';
import { PlayersContainer } from './PlayersContainer';
import { InvalidMessageResult } from './ProcessMessageResult';

import { UIController } from './ui/UIController';

import { PeriodicPieceGenerator } from './board-generation/PeriodicPieceGenerator';

function createMockUiController(): UIController {
  return <any>{
    updateBoard: jest.fn()
  };
}

function createMockPeriodicPieceGenerator() {
  return {
    init: jest.fn(),
    destroy: jest.fn()
  };
}

describe('[GM] Game', () => {
  const boardSize: BoardSize = {
    x: 30,
    goalArea: 50,
    taskArea: 300
  };
  let game: Game;
  let uiController: UIController;
  let loggerInstance: LoggerInstance;
  let periodicPieceGenerator: PeriodicPieceGenerator;

  const actionDelays: ActionDelays = {
    communicationAccept: 4000,
    communicationRequest: 4000,
    destroy: 4000,
    discover: 4000,
    move: 4000,
    pick: 4000,
    test: 4000,
    place: 4000
  };

  let player: Player;

  beforeEach(() => {
    const playersContainter = new PlayersContainer();
    const pointsLimit = 5;
    periodicPieceGenerator = <any>createMockPeriodicPieceGenerator();

    game = new Game(
      boardSize,
      pointsLimit,
      loggerInstance,
      uiController,
      playersContainter,
      actionDelays,
      jest.fn(),
      () => periodicPieceGenerator
    );
    game.state = GameState.InProgress;

    player = new Player();
    player.playerId = 'player';
    player.teamId = 1;
    player.isLeader = true;
    player.isBusy = false;
    player.isConnected = true;

    const loggerFactory = new LoggerFactory();
    loggerInstance = loggerFactory.createEmptyLogger();

    uiController = createMockUiController();
  });

  describe('processMessage', () => {
    it('should reject message from non existing player', () => {
      const message: DiscoveryRequest = {
        senderId: 'player1',
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult = game.processMessage(message);
      expect(processedMessageResult.valid).toBe(false);

      const invalidResult = <InvalidMessageResult>processedMessageResult;
      expect(invalidResult.reason).toMatchSnapshot();
    });

    it('should reject message from busy player', () => {
      game.addPlayer(player);

      player.isBusy = true;

      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult = game.processMessage(message);
      expect(processedMessageResult.valid).toBe(false);

      const invalidResult = <InvalidMessageResult>processedMessageResult;
      expect(invalidResult.reason).toMatchSnapshot();
    });

    it('should reject message when the game is not in progress', () => {
      game.addPlayer(player);
      game.state = GameState.Registered;

      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult = game.processMessage(message);
      expect(processedMessageResult.valid).toBe(false);

      const invalidResult = <InvalidMessageResult>processedMessageResult;
      expect(invalidResult.reason).toMatchSnapshot();
    });

    it('should process valid request', () => {
      game.addPlayer(player);

      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult = game.processMessage(message);
      expect(processedMessageResult.valid).toBe(true);
    });
  });

  describe('start', () => {
    beforeEach(() => {
      game.state = GameState.Registered;
    });

    it('should set game state to InProgress', () => {
      game.start();

      expect(game.state).toBe(GameState.InProgress);
    });

    it('should init PeriodicPieceGenerator', () => {
      game.start();

      expect(periodicPieceGenerator.init).toHaveBeenCalled();
    });

    it('should throw an error when invoked twice', () => {
      game.start();

      expect(() => game.start()).toThrow();
    });
  });

  describe('stop', () => {
    it('should set game state to Finished', () => {
      game.stop();

      expect(game.state).toBe(GameState.Finished);
    });

    it('should init PeriodicPieceGenerator', () => {
      game.stop();

      expect(periodicPieceGenerator.destroy).toHaveBeenCalled();
    });
  });

  it('should add player to the game', () => {
    game.addPlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBe(player);
  });

  it('should remove player from the game', () => {
    game.addPlayer(player);

    game.removePlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBeUndefined();
  });
});
