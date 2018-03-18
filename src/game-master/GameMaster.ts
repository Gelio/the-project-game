import { createConnection } from 'net';
import { LoggerInstance } from 'winston';

import { bindObjectProperties } from '../common/bindObjectProperties';
import { Communicator } from '../common/Communicator';
import { LoggerFactory } from '../common/logging/LoggerFactory';
import { UITransport } from '../common/logging/UITransport';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { GameDefinition, TeamSizes } from '../interfaces/GameDefinition';
import { Message } from '../interfaces/Message';
import { Service } from '../interfaces/Service';

import { ActionInvalidMessage } from '../interfaces/messages/ActionInvalidMessage';
import { ActionValidMessage } from '../interfaces/messages/ActionValidMessage';
import {
  GameStartedMessage,
  GameStartedMessagePayload
} from '../interfaces/messages/GameStartedMessage';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';
import { RegisterGameRequest } from '../interfaces/requests/RegisterGameRequest';
import { RegisterGameResponse } from '../interfaces/responses/RegisterGameResponse';

import { registerUncaughtExceptionHandler } from '../registerUncaughtExceptionHandler';

import { PeriodicPieceGenerator } from './board-generation/PeriodicPieceGenerator';

import { Game } from './Game';
import { GameMasterState } from './GameMasterState';
import { Player } from './Player';
import { PlayersContainer } from './PlayersContainer';

import { UIController } from './ui/UIController';

export interface GameMasterOptions {
  serverHostname: string;
  serverPort: number;
  gameName: string;
  gameDescription: string;
  gamesLimit: number;
  teamSizes: TeamSizes;
  pointsLimit: number;
  boardSize: BoardSize;
  shamChance: number;
  generatePiecesInterval: number;
  piecesLimit: number;
  resultFileName: string;
  actionDelays: ActionDelays;
  timeout: number;
  registrationTriesLimit: number;
}

export class GameMaster implements Service {
  private readonly options: GameMasterOptions;
  private communicator: Communicator;
  private game: Game;
  private playersContainer: PlayersContainer;
  private state: GameMasterState;

  private readonly uiController: UIController;
  private readonly loggerFactory: LoggerFactory;
  private periodicPieceGenerator: PeriodicPieceGenerator;
  private logger: LoggerInstance;

  private readonly messageHandlers: { [type: string]: Function } = {
    PLAYER_HELLO: this.handlePlayerHelloMessage,
    PLAYER_DISCONNECTED: this.handlePlayerDisconnectedMessage
  };

  constructor(
    options: GameMasterOptions,
    uiController: UIController,
    loggerFactory: LoggerFactory
  ) {
    this.options = options;
    this.uiController = uiController;
    this.loggerFactory = loggerFactory;
    this.state = GameMasterState.Connecting;

    bindObjectProperties(this.messageHandlers, this);
    this.destroy = this.destroy.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  public init() {
    this.initUI();
    this.initLogger();
    this.initGame();

    const { serverHostname, serverPort } = this.options;

    const socket = createConnection(
      {
        host: serverHostname,
        port: serverPort
      },
      () => {
        this.logger.info(`Connected to the server at ${serverHostname}:${serverPort}`);
      }
    );

    this.communicator = new Communicator(socket, this.logger);
    this.communicator.bindListeners();

    this.communicator.once('close', this.handleServerDisconnection.bind(this));

    this.registerGame();
  }

  public destroy() {
    if (this.game.hasStarted) {
      this.stopGame();
    }

    this.communicator.destroy();
    this.uiController.destroy();
  }

  private handleServerDisconnection() {
    this.logger.warn('Disconnected from the server. Closing...');

    this.destroy();
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
    this.logger.verbose(`Received player ${message.payload.temporaryId} hello message`);

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

      this.logger.verbose(`Player ${message.payload.temporaryId} rejected. Reason: ${e.message}`);

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

  private async registerGame() {
    const game: GameDefinition = {
      name: this.options.gameName,
      description: this.options.gameDescription,
      teamSizes: this.options.teamSizes,
      boardSize: this.options.boardSize,
      goalLimit: this.options.pointsLimit,
      delays: this.options.actionDelays
    };
    const registerGameMessage: RegisterGameRequest = {
      type: 'REGISTER_GAME_REQUEST',
      senderId: -1,
      payload: game
    };

    this.communicator.sendMessage(registerGameMessage);

    const listGamesResponse = <RegisterGameResponse>await this.communicator.waitForSpecificMessage(
      (msg: MessageWithRecipient<RegisterGameResponse>) => msg.type === 'REGISTER_GAME_RESPONSE'
    );

    this.handleRegisterGameResponse(listGamesResponse);
  }

  private handleRegisterGameResponse(message: RegisterGameResponse) {
    if (message.payload.registered === true) {
      this.logger.verbose('Received game registered response');
      this.updateState(GameMasterState.WaitingForPlayers);

      this.communicator.on('message', this.handleMessage);

      return;
    }

    if (this.options.registrationTriesLimit === 0) {
      throw new Error('Failed to register new game, limit of tries reached');
    }

    this.options.registrationTriesLimit--;

    this.logger.error(
      `Failed to register new game! Next attempt will be made in 10 seconds. Attempts left: ${
        this.options.registrationTriesLimit
      }`
    );

    setTimeout(() => this.registerGame(), 10000);
  }

  private tryAcceptPlayer(message: PlayerHelloMessage) {
    const teamPlayers = this.game.playersContainer.getPlayersFromTeam(message.payload.teamId);

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

    if (teamPlayers.length >= this.options.teamSizes[message.payload.teamId]) {
      throw new Error('Team is full');
    }

    if (message.payload.isLeader && teamPlayers.find(player => player.isLeader)) {
      throw new Error('Team already has a leader');
    }

    if (
      !message.payload.isLeader &&
      teamPlayers.length + 1 === this.options.teamSizes[message.payload.teamId]
    ) {
      throw new Error('Team does not have a leader');
    }

    const newPlayer = new Player();
    newPlayer.playerId = this.game.getNextPlayerId();
    newPlayer.teamId = message.payload.teamId;
    newPlayer.isLeader = message.payload.isLeader;
    newPlayer.isBusy = false;
    newPlayer.isConnected = true;

    this.game.addPlayer(newPlayer);

    return newPlayer.playerId;
  }

  private handlePlayerDisconnectedMessage(message: PlayerDisconnectedMessage) {
    this.logger.verbose('Received player disconnected message');
    const disconnectedPlayer = this.playersContainer.getPlayerById(message.payload.playerId);

    if (!this.game.hasStarted) {
      if (disconnectedPlayer) {
        this.game.removePlayer(disconnectedPlayer);
        this.uiController.updateBoard(this.game.board);
      }

      return;
    }

    if (!disconnectedPlayer) {
      return;
    }

    disconnectedPlayer.isConnected = false;

    const connectedPlayers = this.game.playersContainer.getConnectedPlayers();
    if (connectedPlayers.length === 0) {
      this.logger.info('All players disconnected, disconnecting from the server');
      this.destroy();
      //TODO check if GM should try to start new game
    }
  }

  private initGame() {
    this.playersContainer = new PlayersContainer();

    this.game = new Game(
      this.options.boardSize,
      this.options.pointsLimit,
      this.logger,
      this.uiController,
      this.playersContainer
    );
    this.uiController.updateBoard(this.game.board);

    this.periodicPieceGenerator = new PeriodicPieceGenerator(
      this.game,
      {
        checkInterval: this.options.generatePiecesInterval,
        piecesLimit: this.options.piecesLimit,
        shamChance: this.options.shamChance
      },
      this.logger
    );
  }

  private tryStartGame() {
    const connectedPlayersCount = this.playersContainer.players.length;
    const requiredPlayersCount = this.options.teamSizes['1'] + this.options.teamSizes['2'];

    if (connectedPlayersCount < requiredPlayersCount) {
      return;
    }

    try {
      this.startGame();
    } catch (error) {
      this.logger.error(`Cannot start game - ${error.message}`);
    }
  }

  private startGame() {
    this.logger.info('Game is starting...');

    const team1Players = this.game.playersContainer.getPlayersFromTeam(1);
    const team2Players = this.game.playersContainer.getPlayersFromTeam(2);
    const team1Leader = team1Players.find(player => player.isLeader);
    const team2Leader = team2Players.find(player => player.isLeader);

    if (!team1Leader || !team2Leader) {
      throw new Error('Game cannot start without both leaders');
    }

    this.game.setPlayersPositions();
    this.periodicPieceGenerator.init();
    const gameStartedPayload: GameStartedMessagePayload = {
      teamInfo: {
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

    this.playersContainer.players.forEach(player => {
      const message: GameStartedMessage = {
        senderId: -1,
        recipientId: player.playerId,
        type: 'GAME_STARTED',
        payload: gameStartedPayload
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
    this.uiController.render();
  }

  private initUI() {
    this.uiController.init();
    this.updateState(this.state);
  }

  private initLogger() {
    if (!this.uiController) {
      throw new Error('Cannot create logger without UI controller');
    }

    const uiTransport = new UITransport(this.uiController.log.bind(this.uiController));
    this.logger = this.loggerFactory.createLogger([uiTransport]);
    registerUncaughtExceptionHandler(this.logger);
    this.logger.info('Logger initiated');
  }
}
