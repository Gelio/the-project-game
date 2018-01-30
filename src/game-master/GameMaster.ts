import * as blessed from 'blessed';
import { createConnection } from 'net';
import { LoggerInstance } from 'winston';

import { bindObjectProperties } from '../common/bindObjectProperties';
import { Communicator } from '../common/communicator';
import { createLogger } from '../common/logging/createLogger';
import { UITransport } from '../common/logging/UITransport';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { Message } from '../interfaces/Message';
import { ActionInvalidMessage } from '../interfaces/messages/ActionInvalidMessage';
import { ActionValidMessage } from '../interfaces/messages/ActionValidMessage';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';
import {
  RoundStartedMessage,
  RoundStartedMessagePayload
} from '../interfaces/messages/RoundStartedMessage';
import { Service } from '../interfaces/Service';

import { registerUncaughtExceptionHandler } from '../registerUncaughtExceptionHandler';

import { GoalGenerator } from './board-generation/GoalGenerator';
import { PeriodicPieceGenerator } from './board-generation/PeriodicPieceGenerator';
import { TileGenerator } from './board-generation/TileGenerator';

import { Game } from './Game';
import { GameMasterState } from './GameMasterState';
import { Board } from './models/Board';
import { Player } from './Player';

import { UIController } from './ui/UIController';

export interface GameMasterOptions {
  serverHostname: string;
  serverPort: number;
  roundLimit: number;
  teamSize: number;
  pointsLimit: number;
  boardWidth: number;
  taskAreaHeight: number;
  goalAreaHeight: number;
  shamChance: number;
  generatePiecesInterval: number;
  piecesLimit: number;
  resultFileName: string;
  actionDelays: ActionDelays;
  timeout: number;
}

export class GameMaster implements Service {
  private readonly options: GameMasterOptions;
  private communicator: Communicator;
  private game: Game;
  private screen: blessed.Widgets.Screen;
  private state: GameMasterState;

  private uiController: UIController;
  private periodicPieceGenerator: PeriodicPieceGenerator;
  private logger: LoggerInstance;

  private readonly messageHandlers: { [type: string]: Function } = {
    PLAYER_HELLO: this.handlePlayerHelloMessage,
    PLAYER_DISCONNECTED: this.handlePlayerDisconnectedMessage
  };

  constructor(options: GameMasterOptions, screen: blessed.Widgets.Screen) {
    this.options = options;
    this.screen = screen;
    this.state = GameMasterState.Connecting;

    bindObjectProperties(this.messageHandlers, this);
    this.destroy = this.destroy.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  public init() {
    this.initGame();
    this.initUI();
    this.initLogger();

    const { serverHostname, serverPort } = this.options;

    const socket = createConnection(
      {
        host: serverHostname,
        port: serverPort
      },
      () => {
        this.logger.info(`Connected to the server at ${serverHostname}:${serverPort}`);
        this.updateState(GameMasterState.WaitingForPlayers);
      }
    );

    this.communicator = new Communicator(socket, this.logger);
    this.communicator.bindListeners();

    this.communicator.once('destroy', this.destroy);
    this.communicator.on('message', this.handleMessage);
  }

  public destroy() {
    if (this.game.hasStarted) {
      this.stopGame();
      this.uiController.destroy();
    }

    this.communicator.destroy();
  }

  private async handleMessage<T>(message: Message<T>) {
    if (this.messageHandlers[message.type] !== undefined) {
      return this.messageHandlers[message.type](message);
    }

    const result = this.game.processMessage(message);
    if (!result.valid) {
      const actionInvalidMessage: ActionInvalidMessage = {
        type: 'ACTION_INVALID',
        recipientId: message.senderId,
        senderId: -1,
        payload: {
          reason: result.reason
        }
      };

      return this.communicator.sendMessage(actionInvalidMessage);
    }

    const actionValidMessage: ActionValidMessage = {
      type: 'ACTION_VALID',
      recipientId: message.senderId,
      senderId: -1,
      payload: {
        delay: result.delay
      }
    };

    this.communicator.sendMessage(actionValidMessage);
    this.communicator.sendMessage(await result.responseMessage);
  }

  private handlePlayerHelloMessage(message: PlayerHelloMessage) {
    this.logger.verbose('Received player hello message');

    try {
      const assignedPlayerId = this.tryAcceptPlayer(message);

      const playerAcceptedMessage: PlayerAcceptedMessage = {
        type: 'PLAYER_ACCEPTED',
        senderId: -1,
        recipientId: message.payload.temporaryId,
        payload: {
          assignedPlayerId
        }
      };

      this.communicator.sendMessage(playerAcceptedMessage);
      this.tryStartGame();
    } catch (e) {
      const error: Error = e;

      const playerRejectedMessage: PlayerRejectedMessage = {
        type: 'PLAYER_REJECTED',
        senderId: -1,
        recipientId: message.payload.temporaryId,
        payload: {
          reason: error.message
        }
      };

      return this.communicator.sendMessage(playerRejectedMessage);
    }
  }

  private tryAcceptPlayer(message: PlayerHelloMessage) {
    const teamPlayers = this.game.getPlayersFromTeam(message.payload.teamId);

    if (this.game.hasStarted) {
      const disconnectedPlayer = teamPlayers.find(
        player => !player.isConnected && player.isLeader === message.payload.isLeader
      );

      if (!disconnectedPlayer) {
        throw new Error('Game already started and no more slots free');
      }

      disconnectedPlayer.isConnected = true;

      return disconnectedPlayer.playerId;
    }

    if (teamPlayers.length >= this.options.teamSize) {
      throw new Error('Team is full');
    }

    if (message.payload.isLeader && teamPlayers.find(player => player.isLeader)) {
      throw new Error('Team already has a leader');
    }

    if (!message.payload.isLeader && teamPlayers.length + 1 === this.options.teamSize) {
      throw new Error('Team does not have a leader');
    }

    const newPlayer = new Player();
    newPlayer.playerId = this.game.getNextPlayerId();
    newPlayer.teamId = message.payload.teamId;
    newPlayer.isLeader = message.payload.isLeader;
    newPlayer.isBusy = false;
    newPlayer.isConnected = true;

    this.game.addNewPlayer(newPlayer);

    return newPlayer.playerId;
  }

  private handlePlayerDisconnectedMessage(message: PlayerDisconnectedMessage) {
    this.logger.verbose('Received player disconnected message');
    const disconnectedPlayer = this.game.board.players.find(
      player => player.playerId === message.payload.playerId
    );

    if (!this.game.hasStarted) {
      if (disconnectedPlayer) {
        this.game.board.removePlayer(disconnectedPlayer);
      }

      return;
    }

    if (!disconnectedPlayer) {
      return;
    }

    disconnectedPlayer.isConnected = false;

    const connectedPlayers = this.game.getConnectedPlayers();
    if (connectedPlayers.length === 0) {
      this.logger.info('All players disconnected, disconnecting from the server');
      this.destroy();
    }
  }

  private initGame() {
    const board = this.generateBoard();
    this.game = new Game(board);

    this.periodicPieceGenerator = new PeriodicPieceGenerator(this.game, {
      checkInterval: this.options.generatePiecesInterval,
      piecesLimit: this.options.piecesLimit,
      shamChance: this.options.shamChance
    });
  }

  private generateBoard() {
    const boardSize: BoardSize = {
      x: this.options.boardWidth,
      goalArea: this.options.goalAreaHeight,
      taskArea: this.options.taskAreaHeight
    };

    const tileGenerator = new TileGenerator();
    const tiles = tileGenerator.generateBoardTiles(boardSize);

    const goalGenerator = new GoalGenerator();
    goalGenerator.generateGoals(this.options.pointsLimit, tiles, boardSize);

    return new Board(boardSize, tiles);
  }

  private tryStartGame() {
    const connectedPlayersCount = this.game.board.players.length;
    const requiredPlayersCount = this.options.teamSize * 2;

    if (connectedPlayersCount < requiredPlayersCount) {
      return;
    }

    this.startGame();
  }

  private startGame() {
    this.logger.info('Game is starting...');

    const team1Players = this.game.getPlayersFromTeam(1);
    const team2Players = this.game.getPlayersFromTeam(2);
    const team1Leader = team1Players.find(player => player.isLeader);
    const team2Leader = team2Players.find(player => player.isLeader);

    if (!team1Leader || !team2Leader) {
      throw new Error('Game cannot start without both leaders');
    }

    this.periodicPieceGenerator.init();

    const roundStartedPayload: RoundStartedMessagePayload = {
      boardSize: this.game.board.size,
      currentRound: 0,
      delays: this.options.actionDelays,
      goalLimit: this.options.pointsLimit,
      maxRounds: this.options.roundLimit,
      teams: {
        1: {
          players: team1Players.map(player => player.playerId),
          leaderId: team1Leader.playerId
        },
        2: {
          players: team2Players.map(player => player.playerId),
          leaderId: team2Leader.playerId
        }
      }
    };

    this.game.start();
    this.updateState(GameMasterState.InGame);

    this.game.board.players.forEach(player => {
      const message: RoundStartedMessage = {
        senderId: -1,
        recipientId: player.playerId,
        type: 'ROUND_STARTED',
        payload: roundStartedPayload
      };

      this.communicator.sendMessage(message);
    });

    this.logger.info('Game started');
  }

  private stopGame() {
    this.periodicPieceGenerator.destroy();
    this.game.stop();
    this.updateState(GameMasterState.Finished);
  }

  private updateState(state: GameMasterState) {
    this.state = state;
    this.uiController.updateGameMasterState(state);
    this.uiController.render();
  }

  private initUI() {
    this.uiController = new UIController(this.screen);
    this.uiController.init();
    this.updateState(this.state);
  }

  private initLogger() {
    if (!this.uiController) {
      throw new Error('Cannot create logger without UI controller');
    }

    const uiTransport = new UITransport(this.uiController.log.bind(this.uiController));
    this.logger = createLogger(uiTransport);
    registerUncaughtExceptionHandler(this.logger);
    this.logger.info('Logger initiated');
  }
}
