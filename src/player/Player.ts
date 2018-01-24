import { createConnection } from 'net';

import { config } from './config';

import { Communicator } from '../common/communicator';
import { Message } from '../interfaces/Message';
import { Service } from '../interfaces/Service';

import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';

export interface PlayerOptions {
  serverHostname: string;
  serverPort: number;
  askLevel: number;
  respondLevel: number;
  teamNumber: number;
  teamLeader: boolean;
  timeout: number;
}

export class Player implements Service {
  private id: number;
  private isAccepted = false;

  private options: PlayerOptions;

  private communicator: Communicator;

  private messageHandlers = {
    PLAYER_ACCEPTED: this.handlePlayerAccepted,
    PLAYER_REJECTED: this.handlePlayerRejected
  };

  constructor(options: PlayerOptions) {
    this.options = options;

    Object.keys(this.messageHandlers).forEach(messageType => {
      // @ts-ignore
      this.messageHandlers[messageType] = this.messageHandlers[messageType].bind(this);
    });
  }

  public init() {
    const { serverHostname, serverPort } = this.options;

    const socket = createConnection(
      {
        host: serverHostname,
        port: serverPort
      },
      () => {
        console.info(`Connected to the server at ${serverHostname}:${serverPort}`);
        this.sendHandshake();
      }
    );

    this.communicator = new Communicator(socket);
    this.communicator.bindListeners();

    this.communicator.on('message', this.handleMessage);
  }

  public destroy() {
    this.communicator.destroy();
  }

  private sendHandshake() {
    // tslint:disable-next-line:insecure-random
    const temporaryId = Math.floor(Math.random() * config.maxTemporaryPlayerId);

    const message: PlayerHelloMessage = {
      type: 'PLAYER_HELLO',
      senderId: -2,
      payload: {
        isLeader: this.options.teamLeader,
        teamId: this.options.teamNumber,
        temporaryId
      }
    };

    this.communicator.sendMessage(message);
  }

  private handleMessage<T>(message: Message<T>) {
    console.log('Received message', message);

    // @ts-ignore
    this.messageHandlers[message.type](message);
  }

  private handlePlayerAccepted(message: PlayerAcceptedMessage) {
    this.id = message.payload.assignedPlayerId;
    this.isAccepted = true;

    console.info(`Player accepted with id ${this.id}`);
  }

  private handlePlayerRejected(message: PlayerRejectedMessage) {
    console.log(`Player rejected. Reason: ${message.payload.reason}`);
    this.destroy();
  }
}
