import { close, existsSync, mkdirSync, open, renameSync, write } from 'fs';
import * as sanitize from 'sanitize-filename';
import { promisify } from 'util';

import { GameLog } from '../../interfaces/GameLog';
import { Service } from '../../interfaces/Service';

import { config } from '../../config';

const promisifiedOpen = promisify(open);
const promisifiedClose = promisify(close);
const promisifiedWrite = promisify(write);

export class GameLogsCsvWriter implements Service {
  private readonly fileName: string;
  private readonly fileNameWithExtension: string;
  private fileDescriptor: number = -1;
  private readonly logsDirectory: string;

  constructor(gameName: string) {
    try {
      const safeGameName = sanitize(gameName);
      this.logsDirectory = sanitize(config.logsDirectory);
      this.fileName = `${this.logsDirectory}/${safeGameName}`;
      this.fileNameWithExtension = `${this.fileName}.${config.logsExtension}`;
    } catch {
      this.fileName = 'Invalid config';
      this.fileNameWithExtension = 'csv';
    }
  }

  public async init(): Promise<any> {
    if (this.fileDescriptor > 0) {
      throw new Error('File descriptor already opened');
    }

    this.createLogsDirectory();

    this.renameOldLogs();

    await promisifiedOpen(this.fileNameWithExtension, 'wx')
      .then(fileDescriptor => {
        this.fileDescriptor = fileDescriptor;
      })
      .catch(error => {
        throw new Error(
          `Could not open the file ${this.fileNameWithExtension}. Error code: ${error.code}`
        );
      });

    this.writeHeaders();
  }

  public destroy(): void {
    if (this.fileDescriptor < 0) {
      throw new Error('File descriptor already closed');
    }
    promisifiedClose(this.fileDescriptor)
      .then(() => {
        this.fileDescriptor = 0;
      })
      .catch(error => {
        throw new Error(
          `Could not close the file ${this.fileNameWithExtension}, fd: ${
            this.fileDescriptor
          }, error code: ${error.code}`
        );
      });
  }

  public writeLog(message: GameLog) {
    const line = this.prepareCsvLine(Object.values(message));

    return this.writeLine(line);
  }

  private createLogsDirectory() {
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

  private renameOldLogs() {
    let newFileName;
    try {
      if (existsSync(this.fileNameWithExtension)) {
        const currentDate = new Date();
        newFileName = `${
          this.fileName
        }-${currentDate.toLocaleDateString()}-${currentDate.toLocaleTimeString()}.${
          config.logsExtension
        }`;
        newFileName = newFileName.split(':').join('-');
        renameSync(this.fileNameWithExtension, newFileName);
      }
    } catch (error) {
      throw new Error(
        `Failed to rename ${this.fileNameWithExtension} to
          ${newFileName}`
      );
    }
  }

  private writeHeaders() {
    const gameLogHeader: { [key in keyof GameLog]: null } = {
      type: null,
      timestamp: null,
      playerId: null,
      teamId: null,
      round: null,
      role: null,
      valid: null
    };

    const line = this.prepareCsvLine(Object.keys(gameLogHeader));

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

    promisifiedWrite(this.fileDescriptor, line);
  }
}
