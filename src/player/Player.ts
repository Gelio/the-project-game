import { createConnection } from 'net';
import { LoggerInstance } from 'winston';

import { config } from './config';

import { bindObjectProperties } from '../common/bindObjectProperties';
import { Communicator } from '../common/Communicator';
import { LoggerFactory } from '../common/logging/LoggerFactory';
import { UITransport } from '../common/logging/UITransport';
import { TeamId } from '../common/TeamId';

import { Message } from '../interfaces/Message';
import { PlayerAcceptedMessage } from '../interfaces/messages/PlayerAcceptedMessage';
import { PlayerHelloMessage } from '../interfaces/messages/PlayerHelloMessage';
import { PlayerRejectedMessage } from '../interfaces/messages/PlayerRejectedMessage';
import { Service } from '../interfaces/Service';

import { registerUncaughtExceptionHandler } from '../registerUncaughtExceptionHandler';

import { UIController } from './ui/UIController';

export interface PlayerOptions {
  serverHostname: string;
  serverPort: number;
  askLevel: number;
  respondLevel: number;
  teamNumber: TeamId;
  teamLeader: boolean;
  timeout: number;
}

export class Player implements Service {
  private id: number;
  private isAccepted = false;

  private options: PlayerOptions;

  private communicator: Communicator;
  private logger: LoggerInstance;
  private readonly uiController: UIController;
  private readonly loggerFactory: LoggerFactory;

  private messageHandlers = {
    PLAYER_ACCEPTED: this.handlePlayerAccepted,
    PLAYER_REJECTED: this.handlePlayerRejected
  };

  constructor(options: PlayerOptions, uiController: UIController, loggerFactory: LoggerFactory) {
    this.options = options;

    this.uiController = uiController;
    this.loggerFactory = loggerFactory;

    bindObjectProperties(this.messageHandlers, this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleServerDisconnection = this.handleServerDisconnection.bind(this);
  }

  public init() {
    const { serverHostname, serverPort } = this.options;

    this.initUI();
    this.initLogger();

    const socket = createConnection(
      {
        host: serverHostname,
        port: serverPort
      },
      () => {
        this.logger.info(`Connected to the server at ${serverHostname}:${serverPort}`);
        this.sendHandshake();
      }
    );

    this.communicator = new Communicator(socket, this.logger);
    this.communicator.bindListeners();

    this.communicator.on('message', this.handleMessage);
    this.communicator.on('close', this.handleServerDisconnection);
  }

  public destroy() {
    this.communicator.destroy();
    this.uiController.destroy();
  }

  private handleServerDisconnection() {
    this.destroy();
    this.logger.info('Disconnected from the server');
  }

  private sendHandshake() {
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
    // @ts-ignore
    this.messageHandlers[message.type](message);
  }

  private handlePlayerAccepted(message: PlayerAcceptedMessage) {
    this.id = message.payload.assignedPlayerId;
    this.isAccepted = true;

    this.logger.info(`Player accepted with id ${this.id}`);
  }

  private handlePlayerRejected(message: PlayerRejectedMessage) {
    this.logger.error(`Player rejected. Reason: ${message.payload.reason}`);
    this.destroy();
  }

  private initUI() {
    this.uiController.init();
    this.uiController.render();
  }

  private initLogger() {
    const uiTransport = new UITransport(this.uiController.log.bind(this.uiController));
    this.logger = this.loggerFactory.createLogger([uiTransport]);
    registerUncaughtExceptionHandler(this.logger);

    this.logger.info('Logger initiated');
  }
}
