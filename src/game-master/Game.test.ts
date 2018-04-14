import { LoggerInstance } from 'winston';

import { LoggerFactory } from '../common/logging/LoggerFactory';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';

import { DiscoveryRequest } from '../interfaces/requests/DiscoveryRequest';

import { Game } from './Game';
import { PlayersContainer } from './PlayersContainer';
import { InvalidMessageResult } from './ProcessMessageResult';

import { UIController } from './ui/UIController';

import { Player } from './Player';

function createMockUiController(): UIController {
  return <any>{
    updateBoard: jest.fn()
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

  beforeAll(() => {
    const loggerFactory = new LoggerFactory();
    loggerInstance = loggerFactory.createEmptyLogger();

    uiController = createMockUiController();
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
    player.playerId = 'player';
    player.teamId = 1;
    player.isLeader = true;
    player.isBusy = false;
    player.isConnected = true;
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
      expect(invalidResult).toBeDefined();
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
      expect(invalidResult).toBeDefined();
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

  it('should start the game', () => {
    game.start();
    expect(game.hasStarted).toBe(true);
  });

  it('should stop the game', () => {
    game.stop();
    expect(game.hasStarted).toBe(false);
  });

  describe('after resetting the game', () => {
    it('players should receive new positions', () => {
      game.addPlayer(player);

      const oldPosition = player.position;
      game.reset();

      expect(player.position).not.toBe(oldPosition);
    });
  });

  it('should add player to the game', () => {
    game.addPlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toEqual(player);
  });

  it('should remove player from the game', () => {
    game.addPlayer(player);

    game.removePlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBeUndefined();
  });
});
