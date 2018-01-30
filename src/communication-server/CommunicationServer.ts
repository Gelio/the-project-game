import { createServer, Server, Socket } from 'net';
import { LoggerInstance } from 'winston';

import { Communicator } from '../common/communicator';
import { Service } from '../interfaces/Service';
import { GameMaster } from './GameMaster';
import { MessageRouter } from './MessageRouter';
import { Player } from './player';

import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';

import { registerUncaughtExceptionHandler } from '../registerUncaughtExceptionHandler';
import { createLogger } from './logging/createLogger';

export interface CommunicationServerOptions {
  hostname: string;
  port: number;
}

export class CommunicationServer implements Service {
  private options: CommunicationServerOptions;

  private readonly logger: LoggerInstance;
  private readonly server: Server;
  private gameMaster: GameMaster | null;
  private readonly messageRouter: MessageRouter;
  private readonly players: Player[] = [];

  constructor(options: CommunicationServerOptions, messageRouter: MessageRouter) {
    this.options = options;
    this.server = createServer(this.handleNewClient.bind(this));
    this.gameMaster = null;
    this.messageRouter = messageRouter;
    this.logger = createLogger();
  }

  public init() {
    registerUncaughtExceptionHandler(this.logger);

    this.server.on('error', error => {
      this.logger.error('Server error', error.message);
      this.logger.debug(JSON.stringify(error));
    });
    this.server.listen(this.options.port, this.options.hostname, () => {
      this.logger.info(`Server listening on ${this.options.hostname}:${this.options.port}`);
    });
  }

  public destroy() {
    this.server.close(() => {
      this.logger.info('Server closed');
    });
    this.server.removeAllListeners();
    this.messageRouter.unregisterAll();

    if (this.gameMaster) {
      this.gameMaster.destroy();
    }
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
    this.gameMaster = new GameMaster(communicator, this.messageRouter);

    this.logger.info('Game Master connected');

    communicator.once('destroy', this.handleGameMasterDisconnection.bind(this));

    this.gameMaster.init();
  }

  private handleGameMasterDisconnection() {
    this.gameMaster = null;
    this.players.forEach(player => player.destroy());
    this.destroy();
  }

  private handlePlayer(socket: Socket) {
    if (!this.gameMaster) {
      throw new Error('Player cannot be accepted when there is no Game Master');
    }

    const communicator = new Communicator(socket, this.logger);
    const player = new Player(communicator, this.messageRouter);

    this.logger.info('A new player connected');

    communicator.once('destroy', () => this.handlePlayerDisconnection(player));

    player.init();
  }

  private handlePlayerDisconnection(player: Player) {
    const playerIndex = this.players.indexOf(player);
    this.players.splice(playerIndex, 1);

    if (player.isAccepted) {
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
