import { createConnection } from 'net';
import { LoggerInstance } from 'winston';

import { bindObjectMethods } from '../common/bindObjectMethods';
import { Communicator } from '../common/Communicator';
import { createDelay } from '../common/createDelay';
import { GAME_MASTER_ID } from '../common/EntityIds';
import { CsvWriter } from '../common/logging/CsvWriter';
import { CsvWriterFactory } from '../common/logging/CsvWriterFactory';
import { UITransport } from '../common/logging/UITransport';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { GameDefinition, TeamSizes } from '../interfaces/GameDefinition';
import { GameLog, role } from '../interfaces/GameLog';
import { Message } from '../interfaces/Message';
import { Service } from '../interfaces/Service';

import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';

import { registerUncaughtExceptionHandler } from '../registerUncaughtExceptionHandler';

import { createPeriodicPieceGenerator } from './board-generation/createPeriodicPieceGenerator';
import { PeriodicPieceGeneratorOptions } from './board-generation/PeriodicPieceGenerator';

import { Game } from './Game';
import { GameState } from './GameState';
import { mapOptionsToGameDefinition } from './mapOptionsToGameDefinition';

import { UIController } from './ui/IUIController';

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
  private gameDefinition: GameDefinition;

  private readonly uiController: UIController;
  private logger: LoggerInstance;
  private csvWriter: CsvWriter;

  private failedRegistrations = 0;
  private currentRound = 0;

  private readonly messageHandlers: { [type: string]: Function } = {
    PLAYER_HELLO: this.handlePlayerHelloMessage,
    PLAYER_DISCONNECTED: this.handlePlayerDisconnectedMessage
  };

  constructor(options: GameMasterOptions, uiController: UIController, csvWriter: CsvWriter) {
    this.options = options;
    this.uiController = uiController;
    this.csvWriter = csvWriter;

    bindObjectMethods(this.messageHandlers, this);
    this.destroy = this.destroy.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  public async init() {
    this.initUI();
    this.initLogger();

    const { serverHostname, serverPort } = this.options;

    this.logger.verbose('Connecting to the server');
    const socket = createConnection(
      {
        host: serverHostname,
        port: serverPort
      },
      () => {
        this.logger.info(`Connected to the server at ${serverHostname}:${serverPort}`);
        this.registerGame();
      }
    );

    this.communicator = new Communicator(socket, this.logger);
    this.communicator.bindListeners();

    this.communicator.once('close', this.handleServerDisconnection.bind(this));

    this.gameDefinition = mapOptionsToGameDefinition(this.options);

    try {
      this.csvWriter = this.csvWriterFactory.createCsvWriter(this.gameDefinition.name);
    } catch (error) {
      this.logger.error(`Failed to initialize csvWriter, error: ${error.message}`);
    }

    this.createNewGame();
  }

  public async destroy() {
    this.logger.verbose('Destroying GM');

    if (this.game.state === GameState.InProgress) {
      this.logger.verbose('Stopping and unregistering the game');
      this.game.stop();
      await this.game.unregister();
    }

    this.communicator.destroy();
    this.uiController.destroy();
  }

  private initUI() {
    this.uiController.init();
  }

  private initLogger() {
    if (!this.uiController) {
      throw new Error('Cannot create logger without UI controller');
    }

    this.logger = this.uiController.createLogger();
    registerUncaughtExceptionHandler(this.logger);
    this.logger.info('Logger initialized');
  }

  private handleServerDisconnection() {
    this.logger.warn('Disconnected from the server');

    return this.destroy();
  }

  private async handleMessage(message: Message<any>) {
    const handler = this.messageHandlers[message.type];

    if (handler) {
      return handler(message);
    }

    this.game.handleMessage(message);
  }

  private handlePlayerHelloMessage(message: PlayerHelloMessage) {
    this.logger.verbose(`Received hello message from ${message.senderId}`);

    try {
      this.game.tryAcceptPlayer(message);

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

      this.writeCsvLog(
        message.type,
        message.senderId,
        message.payload.teamId,
        message.payload.isLeader,
        true
      );
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
      try {
        this.writeCsvLog(
          message.type,
          message.senderId,
          message.payload.teamId,
          message.payload.isLeader,
          false
        );
      } catch (error) {
        this.logger.error(`Could not write csv log. error:${error.message}`);
      }

      return this.communicator.sendMessage(playerRejectedMessage);
    }
  }

  private handlePlayerDisconnectedMessage(message: PlayerDisconnectedMessage) {
    this.logger.info(`Player ${message.payload.playerId} disconnected`);
    this.game.handlePlayerDisconnectedMessage(message);

    const players = this.game.playersContainer.players;
    if (players.length === 0) {
      this.logger.info('All players disconnected');

      if (this.game.state === GameState.InProgress) {
        this.onPointsLimitReached();
      }
    }
  }

  private async onPointsLimitReached() {
    this.game.stop();
    await this.unregisterGame();

    this.logger.info(`Round ${this.currentRound} finished`);
    this.logger.info(
      `Score (team1:team2): ${this.game.scoreboard.team1Score}:${this.game.scoreboard.team2Score}`
    );

    if (this.currentRound < this.options.gamesLimit) {
      this.createNewGame();
      await this.registerGame();
    } else {
      this.logger.info('Rounds limit reached');
      this.destroy();
    }
  }

  private createNewGame() {
    const periodicPieceGeneratorOptions: PeriodicPieceGeneratorOptions = {
      checkInterval: this.options.generatePiecesInterval,
      piecesLimit: this.options.piecesLimit,
      shamChance: this.options.shamChance
    };

    this.game = new Game(
      this.gameDefinition,
      this.logger,
      this.uiController,
      this.communicator,
      createPeriodicPieceGenerator(periodicPieceGeneratorOptions, this.logger),
      this.onPointsLimitReached.bind(this),
      this.updateUI.bind(this),
      this.writeCsvLog.bind(this)
    );
    this.currentRound++;
    this.updateUI();
    this.logger.verbose('New game created');
  }

  private tryStartGame() {
    const connectedPlayersCount = this.game.playersContainer.players.length;
    const requiredPlayersCount = this.options.teamSizes['1'] + this.options.teamSizes['2'];

    if (connectedPlayersCount < requiredPlayersCount) {
      return;
    }

    try {
      this.logger.info('Game is starting...');
      this.game.start();
      this.logger.info('Game started');
    } catch (error) {
      this.logger.error(`Cannot start the game - ${error.message}`);
    }
  }

  private async registerGame(): Promise<void> {
    try {
      await this.game.register();
      this.logger.info(`Game "${this.options.gameName}" has been registered`);

      this.failedRegistrations = 0;

      this.communicator.on('message', this.handleMessage);
    } catch (error) {
      this.failedRegistrations++;

      if (this.options.registrationTriesLimit === this.failedRegistrations) {
        this.logger.error('Failed to register new game, limit of tries reached');

        return this.destroy();
      }

      const registrationsTriesLeft = this.options.registrationTriesLimit - this.failedRegistrations;
      this.logger.error(
        `Failed to register new game! Next attempt will be made in ${
          this.options.registerGameInterval
        } miliseconds. Attempts left: ${registrationsTriesLeft}`
      );

      await createDelay(this.options.registerGameInterval);

      return this.registerGame();
    }
  }

  private async unregisterGame() {
    this.logger.verbose('Unregistering the game');

    try {
      await this.game.unregister();
      this.communicator.removeListener('message', this.handleMessage);
    } catch (error) {
      this.logger.error(error.message);
      await this.destroy();
    }
  }

  private updateUI() {
    this.uiController.updateBoard(this.game.board);
    this.uiController.updateGameInfo(
      this.currentRound,
      this.options,
      this.game.board,
      this.game.scoreboard,
      this.game.playersContainer
    );
  }

  private writeCsvLog(
    type: string,
    playerId: string,
    teamId: number,
    isLeader: boolean,
    valid: boolean
  ) {
    const message: GameLog = {
      type,
      timestamp: Date.now(),
      playerId: playerId,
      teamId: teamId,
      round: this.currentRound,
      role: isLeader ? role.Leader : role.Member,
      valid: valid ? 1 : 0
    };
    try {
      this.csvWriter.logMessage(message);
    } catch (error) {
      this.logger.error(`Failed to write log, error: ${error.message}`);
    }
  }
}
