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
import { GoalGenerator } from './board-generation/GoalGenerator';
import { PieceGenerator } from './board-generation/PieceGenerator';
import { TileGenerator } from './board-generation/TileGenerator';
import { Game } from './Game';
import { Player } from './Player';
import {
  RoundStartedMessage,
  RoundStartedMessagePayload
} from '../interfaces/messages/RoundStartedMessage';

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
    } catch (error) {
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

    // TODO: check if it's the last player and team still has no leader

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
    console.log('Received player disconnected message', message);
    const disconnectedPlayer = this.game.players.find(
      player => player.playerId === message.payload.playerId
    );

    if (!this.game.hasStarted) {
      if (disconnectedPlayer) {
        this.game.removePlayer(disconnectedPlayer);
      }

      return;
    }

    if (!disconnectedPlayer) {
      return;
    }

    disconnectedPlayer.isConnected = false;

    const connectedPlayers = this.game.getConnectedPlayers();
    if (connectedPlayers.length === 0) {
      console.log('All players disconnected, disconnecting from the server');
      this.destroy();
    }
  }

  private initGame() {
    const board = this.generateBoard();
    this.game = new Game(board);
    this.generatePieces();
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

  private generatePieces() {
    const pieceGenerator = new PieceGenerator();
    const board = this.game.board;
    const tiles = board.tiles;

    const pieces = pieceGenerator.generatePieces(
      this.options.piecesLimit,
      this.options.shamChance,
      tiles,
      board.size
    );

    pieces.forEach(piece => {
      const { position } = piece;
      tiles[position.x][position.y].piece = piece;
      this.game.pieces.push(piece);
    });
  }

  private tryStartGame() {
    const connectedPlayersCount = this.game.players.length;
    const requiredPlayersCount = this.options.teamSize * 2;

    if (connectedPlayersCount < requiredPlayersCount) {
      return;
    }

    console.log('Game should start');
    // TODO: set an interval for creating pieces periodically
    this.startGame();
  }

  private startGame() {
    const team1Players = this.game.getPlayersFromTeam(1);
    const team2Players = this.game.getPlayersFromTeam(2);
    const team1Leader = team1Players.find(player => player.isLeader);
    const team2Leader = team2Players.find(player => player.isLeader);

    if (!team1Leader || !team2Leader) {
      throw new Error('Game cannot start without both leaders');
    }

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

    this.game.players.forEach(player => {
      const message: RoundStartedMessage = {
        senderId: -1,
        recipientId: player.playerId,
        type: 'ROUND_STARTED',
        payload: roundStartedPayload
      };

      this.communicator.sendMessage(message);
    });
  }
}
