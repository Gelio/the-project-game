import { createServer, Server, Socket } from 'net';

import { Communicator } from '../common/communicator';
import { Service } from '../interfaces/Service';
import { GameMaster } from './GameMaster';
import { MessageRouter } from './MessageRouter';
import { Player } from './player';
import { PlayerDisconnectedMessage } from '../interfaces/messages/PlayerDisconnectedMessage';

export interface CommunicationServerOptions {
  hostname: string;
  port: number;
}

export class CommunicationServer implements Service {
  private options: CommunicationServerOptions;

  private server: Server;
  private gameMaster: GameMaster | null;
  private messageRouter: MessageRouter;
  private players: Player[] = [];

  constructor(options: CommunicationServerOptions, messageRouter: MessageRouter) {
    this.options = options;
    this.server = createServer(this.handleNewClient.bind(this));
    this.gameMaster = null;
    this.messageRouter = messageRouter;
  }

  public init() {
    this.server.on('error', error => {
      console.error('Server error', error);
    });
    this.server.listen(this.options.port, this.options.hostname, () => {
      console.info(`Server listening on ${this.options.hostname}:${this.options.port}`);
    });
  }

  public destroy() {
    this.server.close(() => {
      console.info('Server closed');
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
    const communicator = new Communicator(socket);
    this.gameMaster = new GameMaster(communicator, this.messageRouter);

    console.info('Game Master connected');

    communicator.once('destroy', this.handleGameMasterDisconnection.bind(this));

    this.gameMaster.init();
  }

  private handleGameMasterDisconnection() {
    this.gameMaster = null;
    this.players.forEach(player => player.destroy());
  }

  private handlePlayer(socket: Socket) {
    if (!this.gameMaster) {
      throw new Error('Player cannot be accepted when there is no Game Master');
    }

    const communicator = new Communicator(socket);
    const player = new Player(communicator, this.messageRouter);

    console.info('A new player connected');

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
