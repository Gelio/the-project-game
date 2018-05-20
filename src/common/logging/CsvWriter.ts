import { close, existsSync, open, renameSync, write } from 'fs';
import { promisify } from 'util';

import { GameLog } from '../../interfaces/GameLog';
import { Service } from '../../interfaces/Service';

const promisifiedOpen = promisify(open);
const promisifiedClose = promisify(close);
const promisifiedWrite = promisify(write);

export class CsvWriter implements Service {
  private readonly fileName: string;
  private fileDescriptor: number = -1;

  constructor(gameName: string) {
    this.fileName = `${gameName}.csv`;
  }

  public init(): void {
    if (existsSync(this.fileName)) {
      renameSync(this.fileName, `${this.fileName}.${Date.now()}`);
    }

    if (this.fileDescriptor > 0) {
      throw new Error('File descriptor already opened');
    }

    promisifiedOpen(this.fileName, 'wx')
      .then(fileDescriptor => {
        this.fileDescriptor = fileDescriptor;
      })
      .catch(error => {
        throw new Error(`Could not open the file ${this.fileName}. Error code: ${error.code}`);
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
          `Could not close the file ${this.fileName}, fd: ${this.fileDescriptor}, error code: ${
            error.code
          }`
        );
      });
  }

  public writeLog(message: GameLog) {
    const line = this.prepareCsvLine(Object.values(message));

    return this.writeLine(line);
  }

  private convertToCsvFormat(message: GameLog): string {
    let converted = `${(<any>Object)
      .values(message)
      .map((property: any) => `"${property}"`)
      .join(',')}`;
    converted += '\r\n';

    return converted;
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
