import * as blessed from 'blessed';
import { createConnection } from 'net';
import { LoggerInstance } from 'winston';

import { config } from './config';

import { bindObjectProperties } from '../common/bindObjectProperties';
import { Communicator } from '../common/communicator';
import { createLogger } from '../common/logging/createLogger';
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

  private messageHandlers = {
    PLAYER_ACCEPTED: this.handlePlayerAccepted,
    PLAYER_REJECTED: this.handlePlayerRejected
  };

  constructor(options: PlayerOptions, screen: blessed.Widgets.Screen) {
    this.options = options;

    this.uiController = new UIController(screen);

    bindObjectProperties(this.messageHandlers, this);
    this.handleMessage = this.handleMessage.bind(this);
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
  }

  public destroy() {
    this.communicator.destroy();
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
    this.logger.verbose(`Received message ${message.type}`);

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
    this.logger = createLogger(uiTransport);
    registerUncaughtExceptionHandler(this.logger);

    this.logger.info('Logger initiated');

    this.logger.error('Error');
    this.logger.warn('Warn');
    this.logger.info('Info');
    this.logger.verbose('Verbose');
    this.logger.debug('Debug');
    this.logger.silly('Silly');
  }
}
