import { LoggerInstance } from 'winston';

import { Player } from './Player';
import { PlayersContainer } from './PlayersContainer';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { Message } from '../interfaces/Message';

import { ActionInvalidMessage } from '../interfaces/messages/ActionInvalidMessage';
import { ActionValidMessage } from '../interfaces/messages/ActionValidMessage';
import { GameStartedMessage } from '../interfaces/messages/GameStartedMessage';

import { Board } from './models/Board';
import { Scoreboard } from './models/Scoreboard';

import { GameState } from './GameState';
import { ProcessMessageResult } from './ProcessMessageResult';
import { SendMessageFn } from './SendMessageFn';

import { UIController } from './ui/UIController';

import { PlayerMessageHandler } from './game-logic/PlayerMessageHandler';

import { GAME_MASTER_ID } from '../common/EntityIds';
import { getGameStartedMessagePayload } from '../common/getGameStartedMessagePayload';

import { PeriodicPieceGeneratorFactory } from './board-generation/createPeriodicPieceGenerator';
import { PeriodicPieceGenerator } from './board-generation/PeriodicPieceGenerator';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';

export class Game {
  public board: Board;
  public readonly playersContainer: PlayersContainer;

  private readonly actionDelays: ActionDelays;
  private readonly logger: LoggerInstance;
  private readonly periodicPieceGenerator: PeriodicPieceGenerator;
  private readonly playerMessageHandler: PlayerMessageHandler;
  private readonly scoreboard: Scoreboard;
  private readonly sendMessage: SendMessageFn;
  private readonly uiController: UIController;
  private _state = GameState.Registered;

  public get state() {
    return this._state;
  }

  constructor(
    boardSize: BoardSize,
    pointsLimit: number,
    logger: LoggerInstance,
    uiController: UIController,
    actionDelays: ActionDelays,
    sendMessage: SendMessageFn,
    periodicPieceGeneratorFactory: PeriodicPieceGeneratorFactory
  ) {
    this.board = new Board(boardSize, pointsLimit);
    this.scoreboard = new Scoreboard(pointsLimit);
    this.logger = logger;
    this.uiController = uiController;
    this.playersContainer = new PlayersContainer();
    this.actionDelays = actionDelays;
    this.sendMessage = sendMessage;
    this.periodicPieceGenerator = periodicPieceGeneratorFactory(this.board);

    this.playerMessageHandler = new PlayerMessageHandler({
      board: this.board,
      playersContainer: this.playersContainer,
      actionDelays: this.actionDelays,
      logger: this.logger,
      scoreboard: this.scoreboard,
      sendMessage: this.sendIngameMessage.bind(this)
    });
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
  }

  public async handleMessage(message: Message<any>) {
    // TODO: add unit tests
    // TODO: possibly handle player disconnected message

    const result = this.handlePlayerMessage(message);
    if (!result.valid) {
      const actionInvalidMessage: ActionInvalidMessage = {
        type: 'ACTION_INVALID',
        recipientId: message.senderId,
        senderId: GAME_MASTER_ID,
        payload: {
          reason: result.reason
        }
      };

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

    this.uiController.updateBoard(this.board);
    this.sendIngameMessage(actionValidMessage);
    this.sendIngameMessage(await result.responseMessage);
  }

  /**
   * This method is called internally by `handleMessage`.
   *
   * Left public only in order not to modify the tests by much.
   */
  public handlePlayerMessage(message: Message<any>): ProcessMessageResult<any> {
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
    // TODO: add unit tests for this method
    const disconnectedPlayer = this.playersContainer.getPlayerById(message.payload.playerId);

    if (this.state === GameState.Registered) {
      if (disconnectedPlayer) {
        this.removePlayer(disconnectedPlayer);
        this.uiController.updateBoard(this.board);
      }

      return;
    }

    if (!disconnectedPlayer) {
      return;
    }

    disconnectedPlayer.isConnected = false;
  }

  public removePlayer(disconnectedPlayer: Player) {
    this.board.removePlayer(disconnectedPlayer);
    this.playersContainer.removePlayer(disconnectedPlayer);
  }

  public addPlayer(player: Player) {
    if (player.position === undefined) {
      this.board.setRandomPlayerPosition(player);
    }
    this.playersContainer.addPlayer(player);
    this.board.addPlayer(player);
    this.updateBoard();
  }

  private updateBoard() {
    this.uiController.updateBoard(this.board);
  }

  private sendIngameMessage(message: Message<any>): void {
    if (this.state !== GameState.InProgress) {
      this.logger.notice(
        `Message ${message.type} will not be sent because the game is not in progress`
      );

      return;
    }

    return this.sendMessage(message);
  }

  private sendGameStartedMessageToPlayers() {
    // TODO: add test to check if this message is sent to all players

    const gameStartedMessagePayload = getGameStartedMessagePayload(this.playersContainer);
    this.playersContainer.players.forEach(player => {
      const message: GameStartedMessage = {
        senderId: GAME_MASTER_ID,
        recipientId: player.playerId,
        type: 'GAME_STARTED',
        payload: gameStartedMessagePayload
      };

      this.sendMessage(message);
    });
  }
}
