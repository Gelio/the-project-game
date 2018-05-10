import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createMockCommunicator } from '../common/createMockCommunicator';
import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID } from '../common/EntityIds';
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

function getPlayerDisconnectedMessage(player: Player): any {
  return {
    type: 'PLAYER_DISCONNECTED',
    senderId: COMMUNICATION_SERVER_ID,
    recipientId: GAME_MASTER_ID,
    payload: {
      playerId: player.playerId
    }
  };
}

function getPlayerHelloMessage(playerId: String, isLeader: boolean): any {
  return {
    type: 'PLAYER_HELLO',
    senderId: playerId,
    payload: {
      isLeader,
      teamId: 1,
      game: 'the project game'
    }
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

  describe('handleMessage', () => {
    let spy: any;
    beforeEach(() => {
      spy = jest.spyOn(game, 'sendIngameMessage');
    });

    it('should reject invalid message', () => {
      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };

      game.handleMessage(message);

      const actionInvalidMessage = {
        type: 'ACTION_INVALID',
        recipientId: message.senderId,
        senderId: GAME_MASTER_ID,
        payload: {
          reason: 'Game is not in progress'
        }
      };

      expect(spy).toHaveBeenCalledWith(actionInvalidMessage);
    });
    describe('message with valid action', () => {
      it('should respond with action valid and action result', () => {
        jest.useFakeTimers();
        game.start();

        const message: DiscoveryRequest = {
          senderId: player.playerId,
          type: 'DISCOVERY_REQUEST',
          payload: undefined
        };

        game.handleMessage(message);

        const actionValidMessage = {
          type: 'ACTION_VALID',
          recipientId: message.senderId,
          senderId: GAME_MASTER_ID,
          payload: {
            delay: actionDelays.discover
          }
        };

        const responseMessage = {
          recipientId: message.senderId,
          senderId: GAME_MASTER_ID,
          type: 'ACTION_VALID',
          payload: {
            delay: actionDelays.discover
          }
        };
        expect(spy).toHaveBeenCalledWith(actionValidMessage);
        jest.advanceTimersByTime(actionDelays.discover);
        expect(spy).toHaveBeenCalledWith(responseMessage);

        jest.useRealTimers();
      });

      it('should update UI', () => {
        game.start();

        const message: DiscoveryRequest = {
          senderId: player.playerId,
          type: 'DISCOVERY_REQUEST',
          payload: undefined
        };

        game.handleMessage(message);
        expect(updateUIFn).toBeCalled();
      });
    });
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
    expect(updateUIFn).toBeCalled();
  });

  it('should remove player from the game', () => {
    game.removePlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBeUndefined();
  });

  describe('handlePlayerDisconnected', () => {
    it('should remove player when the game is registered state', () => {
      const message = getPlayerDisconnectedMessage(player);

      game.handlePlayerDisconnectedMessage(message);

      expect(game.playersContainer.getPlayerById(player.playerId)).toBeUndefined();
    });

    it('should disconnect player after the game has started', () => {
      game.start();

      const message = getPlayerDisconnectedMessage(player);

      game.handlePlayerDisconnectedMessage(message);

      expect(player.isConnected).toBe(false);
    });
  });

  describe('register', () => {
    it('should send correct game definition', () => {
      const message = {
        type: 'REGISTER_GAME_REQUEST',
        senderId: GAME_MASTER_ID,
        payload: gameDefinition
      };

      const responseMessage = {
        type: 'REGISTER_GAME_RESPONSE',
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
        payload: {
          registered: true
        }
      };

      communicator.waitForSpecificMessage = jest.fn(() => Promise.resolve(responseMessage));
      game.register();

      expect(communicator.sendMessage).toBeCalledWith(message);
    });

    it('should throw when cannot register the game', () => {
      const message = {
        type: 'REGISTER_GAME_RESPONSE',
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
        payload: {
          registered: false
        }
      };

      communicator.waitForSpecificMessage = jest.fn(() => Promise.resolve(message));
      expect(game.register()).rejects.toEqual(new Error('Cannot register the game'));
    });
  });

  describe('unregister', () => {
    it('should send correct name of the game', () => {
      const message = {
        type: 'UNREGISTER_GAME_REQUEST',
        senderId: GAME_MASTER_ID,
        recipientId: COMMUNICATION_SERVER_ID,
        payload: {
          gameName: gameDefinition.name
        }
      };

      const responseMessage = {
        type: 'UNREGISTER_GAME_RESPONSE',
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
        payload: {
          unregistered: true
        }
      };

      communicator.waitForSpecificMessage = jest.fn(() => Promise.resolve(responseMessage));
      game.unregister();

      expect(communicator.sendMessage).toBeCalledWith(message);
    });

    it('should throw when cannot unregister the game', () => {
      const message = {
        type: 'UNREGISTER_GAME_RESPONSE',
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
        payload: {
          unregistered: false
        }
      };

      communicator.waitForSpecificMessage = jest.fn(() => Promise.resolve(message));
      expect(game.unregister()).rejects.toEqual(new Error('Cannot unregister the game'));
    });
  });

  it('should send game started message to all players', () => {
    const playerIDs = [player.playerId, otherPlayer.playerId];

    game.start();

    playerIDs.forEach(playerId => {
      const message = {
        senderId: GAME_MASTER_ID,
        recipientId: playerId,
        type: 'GAME_STARTED',
        payload: {
          teamInfo: {
            1: {
              leaderId: player.playerId,
              players: [player.playerId]
            },
            2: {
              leaderId: otherPlayer.playerId,
              players: [otherPlayer.playerId]
            }
          }
        }
      };

      expect(communicator.sendMessage).toBeCalledWith(message);
    });
  });

  it('should send game finished message to all players', () => {
    const playerIDs = [player.playerId, otherPlayer.playerId];

    game.stop();

    playerIDs.forEach(playerId => {
      const message = {
        senderId: GAME_MASTER_ID,
        recipientId: playerId,
        type: 'GAME_FINISHED',
        payload: {
          team1Score: 0,
          team2Score: 0
        }
      };

      expect(communicator.sendMessage).toBeCalledWith(message);
    });
  });

  describe('tryAcceptPlayer', () => {
    describe('when game is in progress', () => {
      beforeEach(() => {
        game.start();
      });

      it('no new player should be able to join the game', () => {
        const message = getPlayerHelloMessage('newPlayer', false);

        expect(() => game.tryAcceptPlayer(message)).toThrow();
      });

      it('returning player should be able to reconnect', () => {
        player.isConnected = false;

        const message = getPlayerHelloMessage('newPlayer', true);

        game.tryAcceptPlayer(message);
        expect(player.isConnected).toBe(true);
      });
    });

    describe('when game master is waiting for players', () => {
      it('should reject player when teams are full', () => {
        game.definition.teamSizes['1'] = 1;
        const message = getPlayerHelloMessage('newPlayer', false);

        expect(() => game.tryAcceptPlayer(message)).toThrow();
      });

      it('should reject team leader when team already has leader', () => {
        const message = getPlayerHelloMessage('newPlayer', true);

        expect(() => game.tryAcceptPlayer(message)).toThrow();
      });

      describe('team has only one slot left and doesn`t have team leader', () => {
        it('should reject player who is not a team leader', () => {
          game.definition.teamSizes['1'] = 2;
          player.isLeader = false;

          const message = getPlayerHelloMessage('newPlayer', false);

          expect(() => game.tryAcceptPlayer(message)).toThrow();
        });

        it('should accept team leader', () => {
          game.definition.teamSizes['1'] = 2;
          player.isLeader = false;

          const message = getPlayerHelloMessage('newPlayer', true);

          game.tryAcceptPlayer(message);

          expect(game.playersContainer.getPlayerById(message.senderId)).toBeDefined();
        });
      });
    });

    describe('team has many slots left', () => {
      it('should reject player who is not a team leader', () => {
        const message = getPlayerHelloMessage('newPlayer', false);

        game.tryAcceptPlayer(message);
        expect(game.playersContainer.getPlayerById(message.senderId)).toBeDefined();
      });

      it('should accept team leader when there is no team leader', () => {
        player.isLeader = false;

        const message = getPlayerHelloMessage('newPlayer', true);

        game.tryAcceptPlayer(message);

        expect(game.playersContainer.getPlayerById(message.senderId)).toBeDefined();
      });
    });
  });
});
