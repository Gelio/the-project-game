import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { createMockCommunicator } from '../common/createMockCommunicator';
import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID, PlayerId } from '../common/EntityIds';
import { LoggerFactory } from '../common/logging/LoggerFactory';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { Direction } from '../interfaces/Direction';
import { GameDefinition } from '../interfaces/GameDefinition';

import { ActionInvalidMessage } from '../interfaces/messages/ActionInvalidMessage';
import { ActionValidMessage } from '../interfaces/messages/ActionValidMessage';
import { GameFinishedMessage } from '../interfaces/messages/GameFinishedMessage';
import { GameStartedMessage } from '../interfaces/messages/GameStartedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { DiscoveryRequest } from '../interfaces/requests/DiscoveryRequest';
import { MoveRequest } from '../interfaces/requests/MoveRequest';
import { RegisterGameRequest } from '../interfaces/requests/RegisterGameRequest';
import { TestPieceRequest } from '../interfaces/requests/TestPieceRequest';
import { UnregisterGameRequest } from '../interfaces/requests/UnregisterGameRequest';
import { RegisterGameResponse } from '../interfaces/responses/RegisterGameResponse';
import { TestPieceResponse } from '../interfaces/responses/TestPieceResponse';
import { UnregisterGameResponse } from '../interfaces/responses/UnregisterGameResponse';

import { Game, WriteCsvLogFn } from './Game';
import { GameState } from './GameState';
import { Player } from './Player';
import { InvalidMessageResult } from './ProcessMessageResult';

import { UIController } from './ui/IUIController';

import { PeriodicPieceGenerator } from './board-generation/PeriodicPieceGenerator';

import { Piece } from './models/Piece';

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

function getPlayerDisconnectedMessage(player: Player): PlayerDisconnectedMessage {
  return {
    type: 'PLAYER_DISCONNECTED',
    senderId: COMMUNICATION_SERVER_ID,
    recipientId: GAME_MASTER_ID,
    payload: {
      playerId: player.playerId
    }
  };
}

function getPlayerHelloMessage(playerId: PlayerId, isLeader: boolean): PlayerHelloMessage {
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
    taskArea: 301
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
  let writeCsvLog: WriteCsvLogFn;

  beforeEach(() => {
    periodicPieceGenerator = <any>createMockPeriodicPieceGenerator();
    communicator = createMockCommunicator();
    uiController = createMockUiController();

    const loggerFactory = new LoggerFactory();
    loggerInstance = loggerFactory.createEmptyLogger();

    updateUIFn = jest.fn();
    writeCsvLog = jest.fn();

    game = new Game(
      gameDefinition,
      loggerInstance,
      uiController,
      communicator,
      () => periodicPieceGenerator,
      jest.fn(),
      updateUIFn,
      writeCsvLog
    );

    player = new Player();
    player.playerId = 'player';
    player.teamId = 1;
    player.isLeader = true;
    player.isBusy = false;
    game.addPlayer(player);

    otherPlayer = new Player();
    otherPlayer.playerId = 'otherPlayer';
    otherPlayer.teamId = 2;
    otherPlayer.isLeader = true;
    otherPlayer.isBusy = false;
    game.addPlayer(otherPlayer);
  });

  describe('handleMessage', () => {
    let sendIngameMessageSpy: any;
    beforeEach(() => {
      sendIngameMessageSpy = jest.spyOn(game, 'sendIngameMessage');
    });

    afterEach(() => {
      sendIngameMessageSpy.mockRestore();
    });

    it('should reject message when the game is not in progress', () => {
      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };

      game.handleMessage(message);

      const actionInvalidMessage: ActionInvalidMessage = {
        type: 'ACTION_INVALID',
        recipientId: message.senderId,
        senderId: GAME_MASTER_ID,
        payload: {
          reason: 'Game is not in progress'
        }
      };

      expect(sendIngameMessageSpy).toHaveBeenCalledWith(actionInvalidMessage);
    });

    it('should save csv log', () => {
      const message: DiscoveryRequest = {
        senderId: player.playerId,
        type: 'DISCOVERY_REQUEST',
        payload: undefined
      };

      game.handleMessage(message);

      expect(writeCsvLog).toBeCalled();
    });

    it('should reject message with unknown type', () => {
      game.start();

      const message = {
        senderId: player.playerId,
        type: 'TELEPORT_REQUEST',
        payload: undefined
      };

      game.handleMessage(message);

      const actionInvalidMessage: ActionInvalidMessage = {
        type: 'ACTION_INVALID',
        recipientId: message.senderId,
        senderId: GAME_MASTER_ID,
        payload: {
          reason: 'Unknown message type: TELEPORT_REQUEST'
        }
      };

      expect(sendIngameMessageSpy).toHaveBeenCalledWith(actionInvalidMessage);
    });

    describe('message with valid action', () => {
      it('should respond with action valid and action result', async () => {
        jest.useFakeTimers();
        game.start();

        player.heldPiece = new Piece();
        player.heldPiece.isSham = true;

        const message: TestPieceRequest = {
          senderId: player.playerId,
          type: 'TEST_PIECE_REQUEST',
          payload: undefined
        };

        const responsePromise = game.handleMessage(message);

        const actionValidMessage: ActionValidMessage = {
          type: 'ACTION_VALID',
          recipientId: message.senderId,
          senderId: GAME_MASTER_ID,
          payload: {
            delay: actionDelays.test
          }
        };

        const responseMessage: TestPieceResponse = {
          recipientId: message.senderId,
          senderId: GAME_MASTER_ID,
          type: 'TEST_PIECE_RESPONSE',
          payload: {
            isSham: player.heldPiece.isSham
          }
        };

        expect(sendIngameMessageSpy).toHaveBeenCalledWith(actionValidMessage);
        jest.advanceTimersByTime(actionDelays.test);
        await responsePromise;

        expect(sendIngameMessageSpy).toHaveBeenCalledTimes(2);
        expect(sendIngameMessageSpy).toHaveBeenLastCalledWith(responseMessage);

        jest.useRealTimers();
      });

      it('should update UI', () => {
        game.start();

        const message: MoveRequest = {
          senderId: player.playerId,
          type: 'MOVE_REQUEST',
          payload: {
            direction: Direction.Up
          }
        };

        game.handleMessage(message);
        expect(updateUIFn).toHaveBeenCalled();
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

  it('should add the player to the game', () => {
    const anotherPlayer = new Player();
    anotherPlayer.playerId = 'anotherPlayer';
    anotherPlayer.teamId = 2;
    anotherPlayer.isLeader = true;
    anotherPlayer.isBusy = false;
    game.addPlayer(anotherPlayer);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBe(player);
  });

  it('should update UI after the player is added to the game', () => {
    const anotherPlayer = new Player();
    anotherPlayer.playerId = 'anotherPlayer';

    game.addPlayer(anotherPlayer);

    expect(updateUIFn).toHaveBeenCalled();
  });

  it('should remove the player from the game', () => {
    game.removePlayer(player);

    expect(game.playersContainer.getPlayerById(player.playerId)).toBeUndefined();
  });

  describe('handlePlayerDisconnected', () => {
    it('should remove the player when the game has not started', () => {
      const message = getPlayerDisconnectedMessage(player);

      game.handlePlayerDisconnectedMessage(message);

      expect(game.playersContainer.getPlayerById(player.playerId)).toBeUndefined();
    });

    it('should remove the player when the game has started', () => {
      game.start();

      const message = getPlayerDisconnectedMessage(player);

      game.handlePlayerDisconnectedMessage(message);

      expect(game.playersContainer.getPlayerById(player.playerId)).toBeUndefined();
    });
  });

  describe('register', () => {
    it('should send correct game definition', () => {
      const message: RegisterGameRequest = {
        type: 'REGISTER_GAME_REQUEST',
        senderId: GAME_MASTER_ID,
        payload: {
          game: gameDefinition
        }
      };

      const responseMessage: RegisterGameResponse = {
        type: 'REGISTER_GAME_RESPONSE',
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
        payload: {
          registered: true
        }
      };

      const originalImplementation = communicator.waitForSpecificMessage;

      communicator.waitForSpecificMessage = jest.fn(() => Promise.resolve(responseMessage));
      game.register();

      expect(communicator.sendMessage).toHaveBeenCalledWith(message);

      communicator.waitForSpecificMessage = originalImplementation;
    });

    it('should throw when cannot register the game', () => {
      const message: RegisterGameResponse = {
        type: 'REGISTER_GAME_RESPONSE',
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
        payload: {
          registered: false
        }
      };

      const originalImplementation = communicator.waitForSpecificMessage;

      communicator.waitForSpecificMessage = jest.fn(() => Promise.resolve(message));

      return expect(game.register())
        .rejects.toMatchSnapshot()
        .then(() => {
          communicator.waitForSpecificMessage = originalImplementation;
        });
    });
  });

  describe('unregister', () => {
    it('should send correct name of the game', () => {
      const message: UnregisterGameRequest = {
        type: 'UNREGISTER_GAME_REQUEST',
        senderId: GAME_MASTER_ID,
        recipientId: COMMUNICATION_SERVER_ID,
        payload: {
          gameName: gameDefinition.name
        }
      };

      const responseMessage: UnregisterGameResponse = {
        type: 'UNREGISTER_GAME_RESPONSE',
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
        payload: {
          unregistered: true
        }
      };

      const originalImplementation = communicator.waitForSpecificMessage;

      communicator.waitForSpecificMessage = jest.fn(() => Promise.resolve(responseMessage));
      game.unregister();

      expect(communicator.sendMessage).toHaveBeenCalledWith(message);

      communicator.waitForSpecificMessage = originalImplementation;
    });

    it('should throw when cannot unregister the game', () => {
      const message: UnregisterGameResponse = {
        type: 'UNREGISTER_GAME_RESPONSE',
        senderId: COMMUNICATION_SERVER_ID,
        recipientId: GAME_MASTER_ID,
        payload: {
          unregistered: false
        }
      };

      const originalImplementation = communicator.waitForSpecificMessage;

      communicator.waitForSpecificMessage = jest.fn(() => Promise.resolve(message));

      return expect(game.unregister())
        .rejects.toMatchSnapshot()
        .then(() => {
          communicator.waitForSpecificMessage = originalImplementation;
        });
    });
  });

  it('should send game started message to all players', () => {
    const playerIDs = [player.playerId, otherPlayer.playerId];

    game.start();

    playerIDs.forEach(playerId => {
      const message: GameStartedMessage = {
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

      expect(communicator.sendMessage).toHaveBeenCalledWith(message);
    });
  });

  it('should send game finished message to all players', () => {
    const playerIDs = [player.playerId, otherPlayer.playerId];

    game.stop();

    playerIDs.forEach(playerId => {
      const message: GameFinishedMessage = {
        senderId: GAME_MASTER_ID,
        recipientId: playerId,
        type: 'GAME_FINISHED',
        payload: {
          team1Score: 0,
          team2Score: 0
        }
      };

      expect(communicator.sendMessage).toHaveBeenCalledWith(message);
    });
  });

  describe('tryAcceptPlayer', () => {
    describe('when game is in progress', () => {
      beforeEach(() => {
        game.start();
      });

      it('should not accept new players', () => {
        const message = getPlayerHelloMessage('newPlayer', false);

        expect(() => game.tryAcceptPlayer(message)).toThrow();
      });
    });

    describe('when game master is waiting for players', () => {
      it('should reject the player when team is full', () => {
        game.definition.teamSizes['1'] = 1;
        const message = getPlayerHelloMessage('newPlayer', false);

        expect(() => game.tryAcceptPlayer(message)).toThrow();
      });

      it('should reject team leader when team already has leader', () => {
        const message = getPlayerHelloMessage('newPlayer', true);

        expect(() => game.tryAcceptPlayer(message)).toThrow();
      });

      describe('team has only one slot left and does not have team leader', () => {
        beforeEach(() => {
          player.isLeader = false;
        });

        it('should reject a player who is not a team leader', () => {
          game.definition.teamSizes['1'] = 2;

          const message = getPlayerHelloMessage('newPlayer', false);

          expect(() => game.tryAcceptPlayer(message)).toThrow();
        });

        it('should accept team leader', () => {
          game.definition.teamSizes['1'] = 2;

          const message = getPlayerHelloMessage('newPlayer', true);

          game.tryAcceptPlayer(message);

          expect(game.playersContainer.getPlayerById(message.senderId)).toBeDefined();
        });
      });
    });

    describe('team has many slots left', () => {
      it('should accept a player who is not a team leader', () => {
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
