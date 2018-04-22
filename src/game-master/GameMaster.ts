import { createConnection } from 'net';
import { LoggerInstance } from 'winston';

import { bindObjectMethods } from '../common/bindObjectMethods';
import { Communicator } from '../common/Communicator';
import { GAME_MASTER_ID } from '../common/EntityIds';
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

import { createPeriodicPieceGenerator } from './board-generation/createPeriodicPieceGenerator';
import { PeriodicPieceGeneratorOptions } from './board-generation/PeriodicPieceGenerator';

import { Game } from './Game';
import { GameMasterState } from './GameMasterState';
import { GameState } from './GameState';
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
  registerGameInterval: number;
}

export class GameMaster implements Service {
  private readonly options: GameMasterOptions;
  private communicator: Communicator;
  private game: Game;
  // REFACTOR: move PlayersContainer to `Game
  private playersContainer: PlayersContainer;
  // REFACTOR: remove GameMasterState
  private state: GameMasterState;

  private readonly uiController: UIController;
  private readonly loggerFactory: LoggerFactory;
  private logger: LoggerInstance;
  private failedRegistrations: number;

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

    this.failedRegistrations = 0;

    bindObjectMethods(this.messageHandlers, this);
    this.destroy = this.destroy.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
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
    if (this.game.state === GameState.InProgress) {
      this.stopGame();
    }

    this.communicator.destroy();
    this.uiController.destroy();
  }

  private handleServerDisconnection() {
    this.logger.warn('Disconnected from the server. Closing...');

    this.destroy();
  }

  private async handleMessage(message: Message<any>) {
    const handler = this.messageHandlers[message.type];

    if (handler) {
      return handler(message);
    }

    /**
     * REFACTOR: move the logic below to `Game` since it should be able to handle all messages, not
     * only Player requests
     */
    const result = this.game.processMessage(message);
    if (!result.valid) {
      const actionInvalidMessage: ActionInvalidMessage = {
        type: 'ACTION_INVALID',
        recipientId: message.senderId,
        senderId: GAME_MASTER_ID,
        payload: {
          reason: result.reason
        }
      };

      return this.communicator.sendMessage(actionInvalidMessage);
    }

    const actionValidMessage: ActionValidMessage = {
      type: 'ACTION_VALID',
      recipientId: message.senderId,
      senderId: GAME_MASTER_ID,
      payload: {
        delay: result.delay
      }
    };

    this.uiController.updateBoard(this.game.board);
    this.communicator.sendMessage(actionValidMessage);
    this.communicator.sendMessage(await result.responseMessage);
  }

  private handlePlayerHelloMessage(message: PlayerHelloMessage) {
    this.logger.verbose(`Received player ${message.senderId} hello message`);

    try {
      this.tryAcceptPlayer(message);

      const playerAcceptedMessage: PlayerAcceptedMessage = {
        type: 'PLAYER_ACCEPTED',
        senderId: GAME_MASTER_ID,
        recipientId: message.senderId,
        payload: undefined
      };

      this.communicator.sendMessage(playerAcceptedMessage);
      if (this.game.state === GameState.Registered) {
        this.tryStartGame();
      }
    } catch (e) {
      const error: Error = e;

      this.logger.verbose(`Player ${message.senderId} rejected. Reason: ${e.message}`);

      const playerRejectedMessage: PlayerRejectedMessage = {
        type: 'PLAYER_REJECTED',
        senderId: GAME_MASTER_ID,
        recipientId: message.senderId,
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
      senderId: GAME_MASTER_ID,
      payload: game
    };

    this.communicator.sendMessage(registerGameMessage);

    const listGamesResponse = <RegisterGameResponse>await this.communicator.waitForSpecificMessage(
      (msg: MessageWithRecipient<RegisterGameResponse>) => msg.type === 'REGISTER_GAME_RESPONSE'
    );

    this.handleRegisterGameResponse(listGamesResponse);
  }

  private handleRegisterGameResponse(message: RegisterGameResponse) {
    if (message.payload.registered) {
      this.logger.verbose(`Game \`${this.options.gameName}\` has been registered`);

      this.updateState(GameMasterState.WaitingForPlayers);
      this.failedRegistrations = 0;

      this.communicator.on('message', this.handleMessage);

      return;
    }

    this.failedRegistrations++;

    if (this.options.registrationTriesLimit === this.failedRegistrations) {
      throw new Error('Failed to register new game, limit of tries reached');
    }

    const registrationsTriesLeft = this.options.registrationTriesLimit - this.failedRegistrations;
    this.logger.error(
      `Failed to register new game! Next attempt will be made in ${
        this.options.registerGameInterval
      } miliseconds. Attempts left: ${registrationsTriesLeft}`
    );

    setTimeout(() => this.registerGame(), this.options.registerGameInterval);
  }

  private tryAcceptPlayer(message: PlayerHelloMessage) {
    const teamPlayers = this.game.playersContainer.getPlayersFromTeam(message.payload.teamId);

    if (this.game.state === GameState.InProgress) {
      const disconnectedPlayer = teamPlayers.find(
        player => !player.isConnected && player.isLeader === message.payload.isLeader
      );

      if (!disconnectedPlayer) {
        throw new Error('Game already started and no more slots free');
      }

      disconnectedPlayer.isConnected = true;

      return;
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
    newPlayer.playerId = message.senderId;
    newPlayer.teamId = message.payload.teamId;
    newPlayer.isLeader = message.payload.isLeader;
    newPlayer.isBusy = false;
    newPlayer.isConnected = true;

    this.game.addPlayer(newPlayer);
  }

  private handlePlayerDisconnectedMessage(message: PlayerDisconnectedMessage) {
    // REFACTOR: move this method into `Game` and handle it there
    this.logger.verbose('Received player disconnected message');
    const disconnectedPlayer = this.playersContainer.getPlayerById(message.payload.playerId);

    if (this.game.state === GameState.Registered) {
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
      // TODO: check if GM should try to start new game
    }
  }
  // TODO: add `onGameFinished` method that should possibly restart the game

  private initGame() {
    this.playersContainer = new PlayersContainer();

    const periodicPieceGeneratorOptions: PeriodicPieceGeneratorOptions = {
      checkInterval: this.options.generatePiecesInterval,
      piecesLimit: this.options.piecesLimit,
      shamChance: this.options.shamChance
    };

    this.game = new Game(
      this.options.boardSize,
      this.options.pointsLimit,
      this.logger,
      this.uiController,
      this.playersContainer,
      this.options.actionDelays,
      this.sendMessage,
      createPeriodicPieceGenerator(periodicPieceGeneratorOptions, this.logger)
    );
    this.uiController.updateBoard(this.game.board);
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
        senderId: GAME_MASTER_ID,
        recipientId: player.playerId,
        type: 'GAME_STARTED',
        payload: gameStartedPayload
      };

      this.communicator.sendMessage(message);
    });

    this.logger.info('Game started');
  }

  private stopGame() {
    this.game.stop();
    this.updateState(GameMasterState.Finished);
    // TODO: unregister game
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

  private sendMessage(message: Message<any>): void {
    return this.communicator.sendMessage(message);
  }
}
