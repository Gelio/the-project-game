import { LoggerInstance } from 'winston';

import { Player } from './Player';
import { PlayersContainer } from './PlayersContainer';

import { GameDefinition } from '../interfaces/GameDefinition';
import { Message } from '../interfaces/Message';

import { ActionInvalidMessage } from '../interfaces/messages/ActionInvalidMessage';
import { ActionValidMessage } from '../interfaces/messages/ActionValidMessage';
import {
  GameFinishedMessage,
  GameFinishedMessagePayload
} from '../interfaces/messages/GameFinishedMessage';
import { GameStartedMessage } from '../interfaces/messages/GameStartedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';

import { RegisterGameRequest } from '../interfaces/requests/RegisterGameRequest';
import { UnregisterGameRequest } from '../interfaces/requests/UnregisterGameRequest';
import { RegisterGameResponse } from '../interfaces/responses/RegisterGameResponse';
import { UnregisterGameResponse } from '../interfaces/responses/UnregisterGameResponse';

import { Board } from './models/Board';
import { Scoreboard } from './models/Scoreboard';

import { GameState } from './GameState';
import { ProcessMessageResult } from './ProcessMessageResult';

import { UIController } from './ui/IUIController';

import { PlayerMessageHandler } from './game-logic/PlayerMessageHandler';

import { Communicator } from '../common/Communicator';
import { COMMUNICATION_SERVER_ID, GAME_MASTER_ID, PlayerId } from '../common/EntityIds';

import { PeriodicPieceGeneratorFactory } from './board-generation/createPeriodicPieceGenerator';
import { PeriodicPieceGenerator } from './board-generation/PeriodicPieceGenerator';

import { CommunicationRequestsStore } from './communication/CommunicationRequestsStore';
import { getGameStartedMessagePayload } from './communication/getGameStartedMessagePayload';

export class Game {
  public board: Board;
  public readonly playersContainer: PlayersContainer;
  public readonly definition: GameDefinition;
  public readonly scoreboard: Scoreboard;

  private readonly logger: LoggerInstance;
  private readonly periodicPieceGenerator: PeriodicPieceGenerator;
  private readonly playerMessageHandler: PlayerMessageHandler;
  private readonly communicator: Communicator;
  private readonly uiController: UIController;
  private readonly updateUI: Function;
  private readonly writeCsvLog: (message: Message<any>, playerId: PlayerId, valid: boolean) => any;
  private _state = GameState.Registered;

  public get state() {
    return this._state;
  }

  constructor(
    gameDefinition: GameDefinition,
    logger: LoggerInstance,
    uiController: UIController,
    communicator: Communicator,
    periodicPieceGeneratorFactory: PeriodicPieceGeneratorFactory,
    onPointsLimitReached: Function,
    updateUI: Function,
    writeCsvLog: (message: Message<any>, playerId: PlayerId, valid: boolean) => any
  ) {
    this.definition = gameDefinition;
    this.board = new Board(this.definition.boardSize, this.definition.goalLimit);
    this.scoreboard = new Scoreboard(this.definition.goalLimit);
    this.logger = logger;
    this.uiController = uiController;
    this.playersContainer = new PlayersContainer();
    this.communicator = communicator;
    this.updateUI = updateUI;
    this.writeCsvLog = writeCsvLog;
    this.periodicPieceGenerator = periodicPieceGeneratorFactory(this.board);

    this.playerMessageHandler = new PlayerMessageHandler(
      {
        board: this.board,
        playersContainer: this.playersContainer,
        actionDelays: this.definition.delays,
        logger: this.logger,
        scoreboard: this.scoreboard,
        sendMessage: this.sendIngameMessage.bind(this),
        onPointsLimitReached
      },
      new CommunicationRequestsStore()
    );
  }

  public start() {
    if (this.state === GameState.InProgress) {
      throw new Error('Game is already in progress');
    }

    this._state = GameState.InProgress;
    this.periodicPieceGenerator.init();
    this.sendGameStartedMessageToPlayers();
  }

  public stop() {
    if (this.state === GameState.InProgress) {
      this.periodicPieceGenerator.destroy();
    }

    this._state = GameState.Finished;
    this.sendGameFinishedMessageToPlayers();
  }

  public async handleMessage(message: Message<any>) {
    const messageSender = <Player>this.playersContainer.getPlayerById(message.senderId);

    const result = this.processPlayerMessage(message);
    if (!result.valid) {
      const actionInvalidMessage: ActionInvalidMessage = {
        type: 'ACTION_INVALID',
        recipientId: message.senderId,
        senderId: GAME_MASTER_ID,
        payload: {
          reason: result.reason
        }
      };

      if (messageSender) {
        this.writeCsvLog(
          message.type,
          message.senderId,
          messageSender.teamId,
          messageSender.isLeader,
          false
        );
      } else {
        this.logger.warn('Could not write csv log, invalid senderId');
      }

      return this.sendIngameMessage(actionInvalidMessage);
    }

    const actionValidMessage: ActionValidMessage = {
      type: 'ACTION_VALID',
      recipientId: message.senderId,
      senderId: GAME_MASTER_ID,
      payload: {
        delay: result.delay
      }
    };

    this.writeCsvLog(
      message.type,
      message.senderId,
      messageSender.teamId,
      messageSender.isLeader,
      true
    );

    this.updateUI();
    this.sendIngameMessage(actionValidMessage);
    this.sendIngameMessage(await result.responseMessage);
  }

  /**
   * This method is called internally by `handleMessage`.
   *
   * Left public only in order not to modify the tests by much.
   */
  public processPlayerMessage(message: Message<any>): ProcessMessageResult<any> {
    const sender = this.playersContainer.getPlayerById(message.senderId);
    if (!sender) {
      return {
        valid: false,
        reason: 'Sender ID is invalid'
      };
    }

    if (this.state !== GameState.InProgress) {
      return {
        valid: false,
        reason: 'Game is not in progress'
      };
    }

    if (sender.isBusy) {
      return {
        valid: false,
        reason: 'Sender is busy'
      };
    }

    sender.isBusy = true;

    const processMessageResult = this.playerMessageHandler.handleMessage(sender, message);
    if (processMessageResult.valid) {
      processMessageResult.responseMessage.then(() => (sender.isBusy = false));
    } else {
      sender.isBusy = false;
    }

    return processMessageResult;
  }

  public handlePlayerDisconnectedMessage(message: PlayerDisconnectedMessage) {
    const disconnectedPlayer = this.playersContainer.getPlayerById(message.payload.playerId);

    if (!disconnectedPlayer) {
      return;
    }

    this.removePlayer(disconnectedPlayer);
    this.uiController.updateBoard(this.board);
  }

  public removePlayer(disconnectedPlayer: Player) {
    this.board.removePlayer(disconnectedPlayer);
    this.playersContainer.removePlayer(disconnectedPlayer);
  }

  public addPlayer(player: Player) {
    this.playersContainer.addPlayer(player);
    this.board.addPlayer(player);
    this.updateUI();
  }

  public sendIngameMessage(message: Message<any>): void {
    if (this.state !== GameState.InProgress) {
      this.logger.verbose(
        `Message ${message.type} will not be sent because the game is not in progress`
      );

      return;
    }

    return this.communicator.sendMessage(message);
  }

  public async register() {
    const registerGameMessage: RegisterGameRequest = {
      type: 'REGISTER_GAME_REQUEST',
      senderId: GAME_MASTER_ID,
      payload: {
        game: this.definition
      }
    };

    this.logger.info('Registering the game');
    this.communicator.sendMessage(registerGameMessage);

    const response = <RegisterGameResponse>await this.communicator.waitForSpecificMessage(
      msg => msg.type === 'REGISTER_GAME_RESPONSE'
    );

    if (!response.payload.registered) {
      throw new Error('Cannot register the game');
    }
  }

  public async unregister() {
    const unregisterGameRequest: UnregisterGameRequest = {
      senderId: GAME_MASTER_ID,
      recipientId: COMMUNICATION_SERVER_ID,
      type: 'UNREGISTER_GAME_REQUEST',
      payload: {
        gameName: this.definition.name
      }
    };

    this.communicator.sendMessage(unregisterGameRequest);

    const response = <UnregisterGameResponse>await this.communicator.waitForSpecificMessage(
      msg => msg.type === 'UNREGISTER_GAME_RESPONSE'
    );

    if (!response.payload.unregistered) {
      throw new Error('Cannot unregister the game');
    }
  }

  public tryAcceptPlayer(message: PlayerHelloMessage) {
    const teamPlayers = this.playersContainer.getPlayersFromTeam(message.payload.teamId);

    if (this.state === GameState.InProgress) {
      throw new Error('Game already started');
    }

    if (teamPlayers.length >= this.definition.teamSizes[message.payload.teamId]) {
      throw new Error('Team is full');
    }

    const teamAlreadyHasLeader = teamPlayers.find(player => player.isLeader);
    if (message.payload.isLeader && teamAlreadyHasLeader) {
      throw new Error('Team already has a leader');
    }

    if (
      !message.payload.isLeader &&
      !teamAlreadyHasLeader &&
      teamPlayers.length + 1 === this.definition.teamSizes[message.payload.teamId]
    ) {
      throw new Error('Team does not have a leader');
    }

    const newPlayer = new Player();
    newPlayer.playerId = message.senderId;
    newPlayer.teamId = message.payload.teamId;
    newPlayer.isLeader = message.payload.isLeader;
    newPlayer.isBusy = false;

    this.addPlayer(newPlayer);
  }

  private sendGameStartedMessageToPlayers() {
    const gameStartedMessagePayload = getGameStartedMessagePayload(this.playersContainer);
    this.playersContainer.players.forEach(player => {
      const message: GameStartedMessage = {
        senderId: GAME_MASTER_ID,
        recipientId: player.playerId,
        type: 'GAME_STARTED',
        payload: gameStartedMessagePayload
      };

      this.communicator.sendMessage(message);
    });
  }

  private sendGameFinishedMessageToPlayers() {
    const gameFinishedMessagePayload: GameFinishedMessagePayload = {
      team1Score: this.scoreboard.team1Score,
      team2Score: this.scoreboard.team2Score
    };

    this.playersContainer.players.forEach(player => {
      const gameFinishedMessage: GameFinishedMessage = {
        type: 'GAME_FINISHED',
        senderId: GAME_MASTER_ID,
        recipientId: player.playerId,
        payload: gameFinishedMessagePayload
      };

      this.communicator.sendMessage(gameFinishedMessage);
    });
  }
}
