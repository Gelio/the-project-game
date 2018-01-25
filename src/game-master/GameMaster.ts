import { createConnection } from 'net';

import { bindObjectProperties } from '../common/bindObjectProperties';
import { Board } from '../common/Board';
import { Communicator } from '../common/communicator';
import { Point } from '../common/Point';
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
import { Piece } from './models/Piece';
import { TeamAreaTile } from './models/tiles/TeamAreaTile';
import { Tile } from './models/tiles/Tile';
import { Player } from './Player';
import { TileGenerator } from './TileGenerator';

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
    this.generatePieces(board.tiles);
  }

  private generateBoard() {
    const boardSize: BoardSize = {
      x: this.options.boardWidth,
      goalArea: this.options.goalAreaHeight,
      taskArea: this.options.taskAreaHeight
    };

    const tileGenerator = new TileGenerator(this.options);
    const team1Tiles = tileGenerator.generateTeamAreaTiles(0);
    const neutralTiles = tileGenerator.generateNeutralAreaTiles(this.options.goalAreaHeight);
    const team2Tiles = tileGenerator.generateTeamAreaTiles(
      this.options.goalAreaHeight + this.options.taskAreaHeight
    );

    const tiles = team1Tiles.concat(neutralTiles, team2Tiles);
    this.generateGoals(tiles);

    return new Board(boardSize, tiles);
  }

  private tryStartGame() {
    const connectedPlayersCount = this.game.players.length;
    const requiredPlayersCount = this.options.teamSize * 2;

    if (connectedPlayersCount < requiredPlayersCount) {
      return;
    }

    console.log('Game should start');
    // TODO: create initial pieces and set an interval for creating them periodically
    // TODO: send ROUND_STARTED message to all players
  }

  private generateGoals(tiles: Tile[][]) {
    const positions: Point[] = [];
    for (let i = 0; i < this.options.pointsLimit; i++) {
      let position: Point;
      do {
        position = {
          x: Math.floor(Math.random() * this.options.boardWidth),
          y: Math.floor(Math.random() * this.options.goalAreaHeight)
        };
      } while (
        positions.findIndex(point => point.x === position.x && point.y === position.y) !== -1
      );

      positions.push(position);
    }

    const boardWidth = this.options.boardWidth;
    const boardHeight = this.options.taskAreaHeight + this.options.goalAreaHeight * 2;
    positions.forEach(position => {
      // Team 1
      const team1Tile = <TeamAreaTile>tiles[position.x][position.y];
      team1Tile.hasGoal = true;

      // Team 2
      const team2Tile = <TeamAreaTile>tiles[boardWidth - 1 - position.x][
        boardHeight - 1 - position.y
      ];
      team2Tile.hasGoal = true;
    });
  }

  private generatePieces(tiles: Tile[][]) {
    const minY = this.options.goalAreaHeight + 1;

    for (let i = 0; i < this.options.piecesLimit; i++) {
      let position: Point;
      do {
        position = {
          x: Math.floor(Math.random() * this.options.boardWidth),
          y: minY + Math.floor(Math.random() * this.options.taskAreaHeight)
        };
      } while (tiles[position.x][position.y].piece);

      const piece = new Piece();
      piece.isSham = Math.random() < this.options.shamChance;
      piece.position = position;

      tiles[position.x][position.y].piece = piece;
      this.game.pieces.push(piece);
    }
  }
}
