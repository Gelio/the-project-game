import { LoggerInstance } from 'winston';

import { Player } from './Player';
import { PlayersContainer } from './PlayersContainer';

import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { Message } from '../interfaces/Message';

import { Board } from './models/Board';
import { Scoreboard } from './models/Scoreboard';

import { GameState } from './GameState';
import { ProcessMessageResult } from './ProcessMessageResult';
import { SendMessageFn } from './SendMessageFn';

import { UIController } from './ui/UIController';

import { PlayerMessageHandler } from './game-logic/PlayerMessageHandler';

export class Game {
  public board: Board;
  public playersContainer: PlayersContainer;
  public state = GameState.Registered;

  private readonly logger: LoggerInstance;
  private readonly uiController: UIController;
  private readonly actionDelays: ActionDelays;
  private readonly playerMessageHandler: PlayerMessageHandler;
  private readonly scoreboard: Scoreboard;
  private readonly sendMessage: SendMessageFn;

  constructor(
    boardSize: BoardSize,
    pointsLimit: number,
    logger: LoggerInstance,
    uiController: UIController,
    playersContainer: PlayersContainer,
    actionDelays: ActionDelays,
    sendMessage: SendMessageFn
  ) {
    this.board = new Board(boardSize, pointsLimit);
    this.scoreboard = new Scoreboard(pointsLimit);
    this.logger = logger;
    this.uiController = uiController;
    this.playersContainer = playersContainer;
    this.actionDelays = actionDelays;
    this.sendMessage = sendMessage;

    this.playerMessageHandler = new PlayerMessageHandler({
      board: this.board,
      playersContainer: this.playersContainer,
      actionDelays: this.actionDelays,
      logger: this.logger,
      scoreboard: this.scoreboard,
      sendMessage: this.sendIngameMessage.bind(this)
    });
  }

  public processMessage(message: Message<any>): ProcessMessageResult<any> {
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

  public reset() {
    this.board.reset();
    this.setPlayersPositions();
  }

  public removePlayer(disconnectedPlayer: Player) {
    this.board.removePlayer(disconnectedPlayer);
    this.playersContainer.removePlayer(disconnectedPlayer);
  }

  public setPlayersPositions() {
    this.playersContainer.players.forEach(x => this.board.setRandomPlayerPosition(x));
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
}
