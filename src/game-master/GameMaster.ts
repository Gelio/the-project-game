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
import { GameState } from './GameState';
import { Player } from './Player';

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

    this.game.handleMessage(message);
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
    const disconnectedPlayer = this.game.playersContainer.getPlayerById(message.payload.playerId);

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
      this.options.actionDelays,
      this.sendMessage,
      createPeriodicPieceGenerator(periodicPieceGeneratorOptions, this.logger)
    );
    this.uiController.updateBoard(this.game.board);
  }

  private tryStartGame() {
    const connectedPlayersCount = this.game.playersContainer.players.length;
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
    this.game.start();
    this.logger.info('Game started');
  }

  private stopGame() {
    this.game.stop();
    // TODO: unregister game
  }

  private initUI() {
    this.uiController.init();
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
