import { close, existsSync, mkdirSync, open, write } from 'fs';
import * as sanitize from 'sanitize-filename';
import { promisify } from 'util';

import { GameLog } from '../../interfaces/GameLog';
import { Service } from '../../interfaces/Service';

import { getFormattedDate } from '../formatting/getFormattedDate';

const promisifiedOpen = promisify(open);
const promisifiedClose = promisify(close);
const promisifiedWrite = promisify(write);

export class GameLogsCsvWriter implements Service {
  private readonly fileName: string;
  private readonly fileNameWithExtension: string;
  private fileDescriptor?: number;
  private readonly logsDirectory: string;
  private readonly logsExtension = 'csv';

  constructor(gameName: string, logsDirectory: string) {
    const sanitizedGameName = sanitize(gameName);
    this.logsDirectory = sanitize(logsDirectory);
    this.fileName = `${this.logsDirectory}/${sanitizedGameName}-${getFormattedDate(new Date())}`;
    this.fileNameWithExtension = `${this.fileName}.${this.logsExtension}`;
  }

  public async init(): Promise<any> {
    if (this.fileDescriptor) {
      throw new Error('File descriptor already opened');
    }

    this.createLogsDirectoryIfNotExists();

    try {
      this.fileDescriptor = await promisifiedOpen(this.fileNameWithExtension, 'wx');
    } catch (error) {
      throw new Error(
        `Could not open the file ${this.fileNameWithExtension}. Error code: ${error.code}`
      );
    }

    return this.writeHeaders();
  }

  public async destroy() {
    if (!this.fileDescriptor) {
      throw new Error('File descriptor already closed');
    }
    try {
      await promisifiedClose(this.fileDescriptor);
      this.fileDescriptor = undefined;
    } catch (error) {
      throw new Error(
        `Could not close the file ${this.fileNameWithExtension}, fd: ${
          this.fileDescriptor
        }, error code: ${error.code}`
      );
    }
  }

  public writeLog(message: GameLog) {
    const line = this.prepareCsvLine(Object.values(message));

    return this.writeLine(line);
  }

  private createLogsDirectoryIfNotExists() {
    try {
      if (!existsSync(this.logsDirectory)) {
        mkdirSync(this.logsDirectory);
      }
    } catch (error) {
      throw new Error(
        `Failed to create logs directory ${this.logsDirectory}. Error code: ${error.code}`
      );
    }
  }

  private writeHeaders() {
    const gameLogHeader: { [key in keyof GameLog]: string } = {
      messageType: 'type',
      timestamp: 'timestamp',
      playerId: 'playerId',
      teamId: 'teamId',
      round: 'round',
      playerRole: 'role',
      valid: 'valid'
    };

    const line = this.prepareCsvLine(Object.values(gameLogHeader));

    return this.writeLine(line);
  }

  private prepareCsvLine(elements: any[]) {
    const line = elements.map(x => `"${String(x)}"`).join(',');

    return `${line}\r\n`;
  }

  private writeLine(line: string) {
    if (!this.fileDescriptor) {
      throw new Error('File is not opened');
    }

    return promisifiedWrite(this.fileDescriptor, line);
  }
}
