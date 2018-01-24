import { createConnection } from 'net';

import { Communicator } from '../common/communicator';
import { ActionDelays } from '../interfaces/ActionDelays';
import { Message } from '../interfaces/Message';
import { Service } from '../interfaces/Service';

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

  constructor(options: GameMasterOptions) {
    this.options = options;

    this.handleMessage = this.handleMessage.bind(this);
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
      }
    );

    this.communicator = new Communicator(socket);
    this.communicator.bindListeners();

    this.communicator.on('message', this.handleMessage);
  }

  public destroy() {
    this.communicator.destroy();
  }

  private handleMessage<T>(message: Message<T>) {
    console.log('Received message', message);
  }
}
