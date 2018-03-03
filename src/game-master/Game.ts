import { LoggerInstance } from 'winston';

import { Player } from './Player';
import { PlayersContainer } from './PlayersContainer';

import { createDelay } from '../common/createDelay';
import { Point } from '../common/Point';
import { TeamId } from '../common/TeamId';

import { Message } from '../interfaces/Message';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';

import { Board } from './models/Board';

import { ProcessMessageResult } from './ProcessMessageResult';

import { UIController } from './ui/UIController';

export class Game {
  public hasStarted = false;
  public board: Board;

  // @ts-ignore
  private readonly logger: LoggerInstance;
  private readonly uiController: UIController;
  private readonly playersContainer: PlayersContainer;
  private nextPlayerId = 1;

  constructor(
    board: Board,
    logger: LoggerInstance,
    uiController: UIController,
    playersContainer: PlayersContainer
  ) {
    this.board = board;
    this.logger = logger;
    this.uiController = uiController;
    this.playersContainer = playersContainer;
  }

  public getNextPlayerId() {
    return this.nextPlayerId++;
  }

  public processMessage<T, U>(message: Message<T>): ProcessMessageResult<U> {
    const delay = 500;

    const sender = this.playersContainer.players.find(
      player => player.playerId === message.senderId
    );
    if (!sender) {
      return {
        valid: false,
        reason: 'Sender ID is invalid'
      };
    }

    sender.isBusy = true;

    // TODO: actually handle the message
    const response: MessageWithRecipient<U> = {
      type: 'TEST_RESPONSE',
      payload: <any>5,
      recipientId: message.senderId,
      senderId: -1
    };

    const responsePromise = createDelay(delay).then(() => {
      sender.isBusy = false;

      return response;
    });

    return {
      delay,
      responseMessage: responsePromise,
      valid: true
    };
  }

  public addNewPlayer(player: Player) {
    this.setRandomPlayerPosition(player);
    this.addPlayer(player);
    this.updateBoard();
  }

  public getPlayersFromTeam(teamId: TeamId) {
    return this.playersContainer.players.filter(player => player.teamId === teamId);
  }

  public getConnectedPlayers() {
    return this.playersContainer.players.filter(player => player.isConnected);
  }

  public start() {
    this.hasStarted = true;
  }

  public stop() {
    this.hasStarted = false;
  }

  public removePlayer(disconnectedPlayer: Player) {
    this.board.removePlayer(disconnectedPlayer.position);
    this.playersContainer.removePlayer(disconnectedPlayer);
  }

  private addPlayer(player: Player) {
    this.board.addPlayer(player);
    this.playersContainer.addPlayer(player);
  }

  private setRandomPlayerPosition(player: Player) {
    const yRange = { min: 0, max: this.board.size.goalArea };
    if (player.teamId === 2) {
      yRange.min = this.board.size.goalArea + this.board.size.taskArea;
      yRange.max = yRange.min + this.board.size.goalArea;
    }

    let position: Point;
    do {
      position = {
        x: Math.floor(Math.random() * this.board.size.x),
        y: yRange.min + Math.floor(Math.random() * (yRange.max - yRange.min))
      };
    } while (this.board.getTileAtPosition(position).player);

    player.position = position;
  }

  private updateBoard() {
    this.uiController.updateBoard(this.board);
  }
}
