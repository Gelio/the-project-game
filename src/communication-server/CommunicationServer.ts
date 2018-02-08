import { createServer, Server, Socket } from 'net';
import { LoggerInstance } from 'winston';

import { Communicator } from '../common/Communicator';
import { Service } from '../interfaces/Service';
import { GameMaster } from './GameMaster';
import { MessageRouter } from './MessageRouter';
import { Player } from './Player';

import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';

import { registerUncaughtExceptionHandler } from '../registerUncaughtExceptionHandler';

export interface CommunicationServerOptions {
  hostname: string;
  port: number;
}

export class CommunicationServer implements Service {
  private options: CommunicationServerOptions;

  private unregisterUncaughtExceptionHandlerCallback?: Function;
  private isRunning = false;

  private readonly logger: LoggerInstance;
  private readonly server: Server;
  private gameMaster: GameMaster | null;
  private readonly messageRouter: MessageRouter;
  private readonly players: Player[] = [];

  constructor(
    options: CommunicationServerOptions,
    messageRouter: MessageRouter,
    logger: LoggerInstance
  ) {
    this.options = options;
    this.server = createServer(this.handleNewClient.bind(this));
    this.gameMaster = null;
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
        this.isRunning = true;
        resolve(true);
      });
    });
  }

  public destroy() {
    this.logger.info('Closing the server...');
    this.isRunning = false;
    this.server.removeAllListeners();

    if (this.gameMaster) {
      this.gameMaster.destroy();
      this.gameMaster = null;
    }

    this.players.forEach(player => player.destroy());
    this.players.splice(0, this.players.length);

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
    if (!this.gameMaster) {
      this.handleGameMaster(socket);
    } else {
      this.handlePlayer(socket);
    }
  }

  private handleGameMaster(socket: Socket) {
    const communicator = new Communicator(socket, this.logger);
    this.gameMaster = new GameMaster(communicator, this.messageRouter, this.logger);

    this.logger.info('Game Master connected');
    this.logger.verbose(`Game Master address: ${socket.remoteAddress}:${socket.remotePort}`);

    communicator.once('destroy', this.handleGameMasterDisconnection.bind(this));

    this.gameMaster.init();
  }

  private handleGameMasterDisconnection() {
    this.logger.info('Game Master disconnected');
    this.gameMaster = null;

    if (this.isRunning) {
      this.destroy();
    }
  }

  private handlePlayer(socket: Socket) {
    if (!this.gameMaster) {
      throw new Error('Player cannot be accepted when there is no Game Master');
    }

    const communicator = new Communicator(socket, this.logger);
    const player = new Player(communicator, this.messageRouter, this.logger);
    this.players.push(player);

    this.logger.info('A new player connected');
    this.logger.verbose(`New player's IP: ${socket.remoteAddress}:${socket.remotePort}`);

    communicator.once('destroy', () => this.handlePlayerDisconnection(player));

    player.init();
  }

  private handlePlayerDisconnection(player: Player) {
    const playerIndex = this.players.indexOf(player);
    this.players.splice(playerIndex, 1);

    if (player.isAccepted && this.gameMaster) {
      const playerDisconnectedMessage: PlayerDisconnectedMessage = {
        type: 'PLAYER_DISCONNECTED',
        recipientId: -1,
        senderId: -3,
        payload: {
          playerId: player.id
        }
      };

      this.messageRouter.sendMessageToGameMaster(playerDisconnectedMessage);
    }
  }
}
