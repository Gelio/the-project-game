import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createMockCommunicator } from '../common/createMockCommunicator';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { GameDefinition } from '../interfaces/GameDefinition';

import { DiscoveryRequest } from '../interfaces/requests/DiscoveryRequest';

import { Game } from './Game';
import { GameState } from './GameState';
import { Player } from './Player';
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

  let game: Game;
  let uiController: UIController;
  let loggerInstance: LoggerInstance;
  let periodicPieceGenerator: PeriodicPieceGenerator;
  let communicator: Communicator;

  const gameDefinition: GameDefinition = {
    boardSize,
    name: 'test name',
    teamSizes: {
      1: 10,
      2: 10
    },
    delays: actionDelays,
    description: 'test description',
    goalLimit: 5
  };

  let player: Player;
  let otherPlayer: Player;

  beforeEach(() => {
    periodicPieceGenerator = <any>createMockPeriodicPieceGenerator();
    communicator = createMockCommunicator();

    game = new Game(
      gameDefinition,
      loggerInstance,
      uiController,
      communicator,
      jest.fn(),
      () => periodicPieceGenerator
    );

    player = new Player();
    player.playerId = 'player';
    player.teamId = 1;
    player.isLeader = true;
    player.isBusy = false;
    player.isConnected = true;

    otherPlayer = new Player();
    otherPlayer.playerId = 'otherPlayer';
    otherPlayer.teamId = 2;
    otherPlayer.isLeader = true;
    otherPlayer.isBusy = false;
    otherPlayer.isConnected = true;
    game.addPlayer(otherPlayer);

    const loggerFactory = new LoggerFactory();
    loggerInstance = loggerFactory.createEmptyLogger();

    uiController = createMockUiController();
  });

  describe('processMessage', () => {
    describe('after game started', () => {
      beforeEach(() => {
        game.start();
      });

      it('should reject message from non existing player', () => {
        const message: DiscoveryRequest = {
          senderId: 'player1',
          type: 'DISCOVERY_REQUEST',
          payload: undefined
        };
        const processedMessageResult = game.handlePlayerMessage(message);
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
        const processedMessageResult = game.handlePlayerMessage(message);
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
        const processedMessageResult = game.handlePlayerMessage(message);
        expect(processedMessageResult.valid).toBe(true);
      });
    });

    it('should reject message when the game is not in progress', () => {
      game.addPlayer(player);

      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult = game.handlePlayerMessage(message);
      expect(processedMessageResult.valid).toBe(false);

      const invalidResult = <InvalidMessageResult>processedMessageResult;
      expect(invalidResult.reason).toMatchSnapshot();
    });
  });

  describe('start', () => {
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

    it('should stop PeriodicPieceGenerator', () => {
      game.start();
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
