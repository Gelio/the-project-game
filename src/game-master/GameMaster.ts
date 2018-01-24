import { createConnection } from 'net';

import { bindObjectProperties } from '../common/bindObjectProperties';
import { Board } from '../common/Board';
import { Communicator } from '../common/communicator';
import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { Message } from '../interfaces/Message';
import { ActionInvalidMessage } from '../interfaces/messages/ActionInvalidMessage';
import { ActionValidMessage } from '../interfaces/messages/ActionValidMessage';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';
import { Service } from '../interfaces/Service';
import { Game } from './Game';

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
  timeout: 10000;
}

export class GameMaster implements Service {
  private options: GameMasterOptions;
  private communicator: Communicator;
  private game: Game;

  private messageHandlers: { [type: string]: Function } = {
    PLAYER_HELLO: this.handlePlayerHelloMessage,
    PLAYER_DISCONNECTED: this.handlePlayerDisconnectedMessage
  };

  constructor(options: GameMasterOptions) {
    this.options = options;

    bindObjectProperties(this.messageHandlers, this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  public init() {
    this.initGame();

    const { serverHostname, serverPort } = this.options;

    const socket = createConnection(
      {
        host: serverHostname,
        port: serverPort
      },
      () => {
        console.info(`Connected to the server at ${serverHostname}:${serverPort}`);
      }
    );

    this.communicator = new Communicator(socket);
    this.communicator.bindListeners();

    this.communicator.on('message', this.handleMessage);
  }

  public destroy() {
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
    console.log('Received player hello message', message);

    if (!this.canAcceptPlayer(message)) {
      const playerRejectedMessage: PlayerRejectedMessage = {
        type: 'PLAYER_REJECTED',
        senderId: -1,
        recipientId: message.payload.temporaryId,
        payload: {
          reason: 'TODO'
        }
      };

      return this.communicator.sendMessage(playerRejectedMessage);
    }

    // TODO: check if can replace existing player if game has already started

    const assignedPlayerId = this.game.getNextPlayerId();
    const playerAcceptedMessage: PlayerAcceptedMessage = {
      type: 'PLAYER_ACCEPTED',
      senderId: -1,
      recipientId: message.payload.temporaryId,
      payload: {
        assignedPlayerId
      }
    };

    this.communicator.sendMessage(playerAcceptedMessage);

    // TODO: add player on board (if cannot replace existing player)

    // TODO: start game if enough players and game is not started
  }

  private canAcceptPlayer(message: PlayerHelloMessage) {
    return true;
  }

  private handlePlayerDisconnectedMessage(message: PlayerDisconnectedMessage) {
    console.log('Received player disconnected message', message);
    // TODO: if game is not started, remove the player
    // TODO: if no players are left, disconnect
  }

  private initGame() {
    const boardSize: BoardSize = {
      x: this.options.boardWidth,
      goalArea: this.options.goalAreaHeight,
      taskArea: this.options.taskAreaHeight
    };

    const board = new Board(boardSize);

    this.game = new Game(board);
  }
}
