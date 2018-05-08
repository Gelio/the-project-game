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
import { CommunicationRequestFromSender } from '../interfaces/requests/CommunicationRequest';
import { Point } from '../common/Point';
import { MoveRequest } from '../interfaces/requests/MoveRequest';

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

  let game: Game;
  let uiController: UIController;
  let loggerInstance: LoggerInstance;
  let periodicPieceGenerator: PeriodicPieceGenerator;
  let communicator: Communicator;
  let player: Player;
  let otherPlayer: Player;
  // TODO: add tests using updateUIFn
  let updateUIFn: Function;

  beforeEach(() => {
    periodicPieceGenerator = <any>createMockPeriodicPieceGenerator();
    communicator = createMockCommunicator();
    uiController = createMockUiController();

    const loggerFactory = new LoggerFactory();
    loggerInstance = loggerFactory.createEmptyLogger();

    updateUIFn = jest.fn();

    game = new Game(
      gameDefinition,
      loggerInstance,
      uiController,
      communicator,
      () => periodicPieceGenerator,
      jest.fn(),
      updateUIFn
    );

    player = new Player();
    player.playerId = 'player';
    player.teamId = 1;
    player.isLeader = true;
    player.isBusy = false;
    player.isConnected = true;
    game.addPlayer(player);

    otherPlayer = new Player();
    otherPlayer.playerId = 'otherPlayer';
    otherPlayer.teamId = 2;
    otherPlayer.isLeader = true;
    otherPlayer.isBusy = false;
    otherPlayer.isConnected = true;
    game.addPlayer(otherPlayer);
  });

  describe('processMessage', () => {
    describe('after game started', () => {
      beforeEach(() => {
        game.start();
      });

      it('should reject message from non existing player', () => {
        const message: DiscoveryRequest = {
          senderId: 'non existing player',
          type: 'DISCOVERY_REQUEST',
          payload: undefined
        };
        const processedMessageResult = game.processPlayerMessage(message);
        expect(processedMessageResult.valid).toBe(false);

        const invalidResult = <InvalidMessageResult>processedMessageResult;
        expect(invalidResult.reason).toMatchSnapshot();
      });

      it('should reject message from busy player', () => {
        player.isBusy = true;

        const message: DiscoveryRequest = {
          senderId: player.playerId,
          type: 'DISCOVERY_REQUEST',
          payload: undefined
        };
        const processedMessageResult = game.processPlayerMessage(message);
        expect(processedMessageResult.valid).toBe(false);

        const invalidResult = <InvalidMessageResult>processedMessageResult;
        expect(invalidResult.reason).toMatchSnapshot();
      });

      it('should reject invalid request from player', () => {
        const message = {
          senderId: player.playerId,
          type: 'MOVE_REQUEST',
          payload: {
            direction: 'adasds'
          }
        };
        const processedMessageResult = game.processPlayerMessage(message);
        expect(processedMessageResult.valid).toBe(false);

        const invalidResult = <InvalidMessageResult>processedMessageResult;
        expect(invalidResult.reason).toMatchSnapshot();
      });

      it('should process valid request', () => {
        const message: DiscoveryRequest = {
          senderId: player.playerId,
          type: 'DISCOVERY_REQUEST',
          payload: undefined
        };
        const processedMessageResult = game.processPlayerMessage(message);
        expect(processedMessageResult.valid).toBe(true);
      });
    });

    it('should reject message when the game is not in progress', () => {
      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };
      const processedMessageResult = game.processPlayerMessage(message);
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
    const anotherPlayer = new Player();
    anotherPlayer.playerId = 'anotherPlayer';
    anotherPlayer.teamId = 2;
    anotherPlayer.isLeader = true;
    anotherPlayer.isBusy = false;
    anotherPlayer.isConnected = true;

    game.addPlayer(anotherPlayer);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBe(player);
  });

  it('should remove player from the game', () => {
    game.removePlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBeUndefined();
  });

  describe('handlePlayerDisconnected', () => {});
});
