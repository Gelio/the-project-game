import { createServer, Server, Socket } from 'net';
import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { Service } from '../interfaces/Service';
import { Game } from './Game';
import { GameMaster } from './GameMaster';
import { MessageRouter } from './MessageRouter';
import { Player } from './Player';

import { Message } from '../interfaces/Message';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';
import { RegisterGameRequest } from '../interfaces/requests/RegisterGameRequest';
import { RegisterGameResponse } from '../interfaces/responses/RegisterGameResponse';

import { registerUncaughtExceptionHandler } from '../registerUncaughtExceptionHandler';
import { PlayerInfo } from './PlayerInfo';

export interface CommunicationServerOptions {
  hostname: string;
  port: number;
}

export class CommunicationServer implements Service {
  private options: CommunicationServerOptions;

  private unregisterUncaughtExceptionHandlerCallback?: Function;

  private readonly logger: LoggerInstance;
  private readonly server: Server;
  private readonly messageRouter: MessageRouter;
  private readonly communicators: Communicator[] = [];
  private readonly gameMasters: Map<string, GameMaster> = new Map();

  constructor(
    options: CommunicationServerOptions,
    messageRouter: MessageRouter,
    logger: LoggerInstance
  ) {
    this.options = options;
    this.server = createServer(this.handleNewClient.bind(this));
    this.messageRouter = messageRouter;
    this.logger = logger;
  }

  public init() {
    this.unregisterUncaughtExceptionHandlerCallback = registerUncaughtExceptionHandler(this.logger);

    this.server.on('error', error => {
      this.logger.error(`Server error: ${error.message}`, error);
      this.logger.debug(JSON.stringify(error));
    });

    return new Promise((resolve, reject) => {
      this.server.listen(this.options.port, this.options.hostname, (error?: Error) => {
        if (error) {
          this.logger.error(`Server cannot start listening: ${error.message}`, error);

          return reject(error);
        }

        this.logger.info(`Server listening on ${this.options.hostname}:${this.options.port}`);
        resolve(true);
      });
    });
  }

  public destroy() {
    this.logger.info('Closing the server...');
    this.server.removeAllListeners();

    this.communicators.forEach(communicator => communicator.destroy());

    return new Promise((resolve, reject) => {
      this.server.close((error?: Error) => {
        if (error) {
          this.logger.error(`Server cannot be closed due to an error: ${error.message}`, error);

          return reject(error);
        }

        if (this.unregisterUncaughtExceptionHandlerCallback) {
          this.unregisterUncaughtExceptionHandlerCallback();
        }

        this.logger.info('Server closed and will no longer accept connections');
        resolve(true);
      });
    });
  }

  private handleNewClient(socket: Socket) {
    const communicator = new Communicator(socket, this.logger);
    communicator.bindListeners();

    this.communicators.push(communicator);
    communicator.on('destroy', this.handleClientDisconnection.bind(this, communicator));
    communicator.on('message', this.handleClientsFirstMessage.bind(this, communicator));

    this.logger.info('A new client connected');
    this.logger.verbose(`New client's IP: ${socket.remoteAddress}:${socket.remotePort}`);
  }

  private handleClientDisconnection(communicator: Communicator) {
    const index = this.communicators.indexOf(communicator);
    if (index === -1) {
      this.logger.error('Communicator not found when it should be deleted');

      return;
    }

    this.communicators.splice(index, 1);
  }

  private handleClientsFirstMessage(communicator: Communicator, message: Message<any>) {
    switch (message.type) {
      case 'PLAYER_HELLO':
        this.handlePlayer(communicator, <PlayerHelloMessage>message);
        break;

      case 'LIST_GAMES_REQUEST':
        this.handleListGamesRequest(communicator);
        break;

      case 'REGISTER_GAME_REQUEST':
        this.handleGameMaster(communicator, <RegisterGameRequest>message);
        break;

      default:
        this.logger.error(
          `Unknown message type ${message.type} from sender ID ${message.senderId}`
        );
    }
  }

  private handleGameMaster(communicator: Communicator, registerGameRequest: RegisterGameRequest) {
    if (this.gameMasters.has(registerGameRequest.payload.name)) {
      const failedResponse: RegisterGameResponse = {
        type: 'REGISTER_GAME_RESPONSE',
        senderId: -3,
        recipientId: -1,
        payload: {
          registered: false
        }
      };

      communicator.sendMessage(failedResponse);

      return;
    }

    // Stop listening for the client's initial message
    communicator.removeAllListeners('message');

    const game = new Game(registerGameRequest.payload);
    const gameMaster = new GameMaster(communicator, this.messageRouter, this.logger, game);
    this.gameMasters.set(game.gameDefinition.name, gameMaster);

    communicator.once('destroy', this.handleGameMasterDisconnection.bind(this, gameMaster));

    this.logger.info(`Registered game ${game.gameDefinition.name}`);
    gameMaster.init();

    const successResponse: RegisterGameResponse = {
      type: 'REGISTER_GAME_RESPONSE',
      senderId: -3,
      recipientId: -1,
      payload: {
        registered: true
      }
    };

    communicator.sendMessage(successResponse);
  }

  private handleGameMasterDisconnection(gameMaster: GameMaster) {
    const gameName = gameMaster.game.gameDefinition.name;
    this.logger.info(`Game Master from game ${gameName} disconnected`);

    if (this.gameMasters.get(gameName) !== gameMaster) {
      this.logger.error(
        `Disconnected Game Master for game ${gameName} differs from the one registered`
      );

      return;
    }

    this.gameMasters.delete(gameName);
  }

  private async handlePlayer(communicator: Communicator, helloMessage: PlayerHelloMessage) {
    const gameName = helloMessage.payload.game;
    const gameMaster = this.gameMasters.get(gameName);
    if (!gameMaster) {
      const response: PlayerRejectedMessage = {
        type: 'PLAYER_REJECTED',
        senderId: -1,
        recipientId: helloMessage.payload.temporaryId,
        payload: {
          reason: 'Game does not exist'
        }
      };

      communicator.sendMessage(response);

      return;
    }

    this.messageRouter.registerPlayerCommunicator(helloMessage.payload.temporaryId, communicator);
    gameMaster.sendMessage(helloMessage);

    const gameMasterResponse = await gameMaster.communicator.waitForSpecificMessage(
      (msg: MessageWithRecipient<any>) => msg.recipientId === helloMessage.payload.temporaryId
    );

    this.messageRouter.unregisterPlayerCommunicator(helloMessage.payload.temporaryId);
    communicator.sendMessage(gameMasterResponse);

    if (gameMasterResponse.type !== 'PLAYER_ACCEPTED') {
      return;
    }

    const playerAcceptedMessage = <PlayerAcceptedMessage>gameMasterResponse;

    // Stop listening for the client's initial message
    communicator.removeAllListeners('message');

    const playerInfo: PlayerInfo = {
      gameName,
      teamId: helloMessage.payload.teamId,
      id: playerAcceptedMessage.payload.assignedPlayerId,
      isLeader: helloMessage.payload.isLeader
    };
    const player = new Player(communicator, this.messageRouter, this.logger, playerInfo);

    if (helloMessage.payload.teamId === 1) {
      gameMaster.game.team1Players.push(player);
    } else {
      gameMaster.game.team2Players.push(player);
    }

    this.logger.info(
      `A new player joined the game ${gameName} (${gameMaster.game.getPlayersCount()} / ${gameMaster.game.getGameCapacity()}`
    );

    communicator.once('destroy', () => this.handlePlayerDisconnection(player));
    player.init();
  }

  private handleListGamesRequest(_communicator: Communicator) {
    // TODO: get game definitions and send it to communicator
  }

  private handlePlayerDisconnection(player: Player) {
    const { gameName, id: playerId, teamId } = player.info;
    const gameMaster = this.gameMasters.get(gameName);
    if (!gameMaster) {
      return;
    }

    const playerList = teamId === 1 ? gameMaster.game.team1Players : gameMaster.game.team2Players;
    const index = playerList.indexOf(player);
    if (index === -1) {
      this.logger.error(`Player ${playerId} should be removed from game list but was not found`);

      return;
    }

    playerList.splice(index, 1);

    if (this.messageRouter.hasRegisteredGameMasterCommunicator(player.info.gameName)) {
      const playerDisconnectedMessage: PlayerDisconnectedMessage = {
        type: 'PLAYER_DISCONNECTED',
        recipientId: -1,
        senderId: -3,
        payload: {
          playerId: player.info.id
        }
      };

      this.messageRouter.sendMessageToGameMaster(player.info.gameName, playerDisconnectedMessage);
    }
  }
}
