import * as fs from 'fs';

import { GameLog } from '../interfaces/GameLog';

export class CsvWriter {
  private readonly fileName: string;

  constructor(gameName: string) {
    this.fileName = `${gameName}.csv`;
    fs.rename(this.fileName, `${this.fileName}.${Date.now()}`, error => {
      throw error;
    });

    const gameLog: GameLog = {
      role: '',
      round: '',
      senderId: '',
      teamId: '',
      timestamp: '',
      type: '',
      valid: ''
    };
    const headers =
      `${Object.keys(gameLog)
        .map(value => `"${value}"`)
        .join(',')}` + '\r\n';

    fs.writeFile(this.fileName, headers, error => {
      throw new Error(`Failed to create logs file, error ${error.message}`);
    });
  }

  public logMessage(message: GameLog) {
    fs.appendFile(this.fileName, this.convertToCsvFormat(message), error => {
      throw error;
    });
  }

  private convertToCsvFormat(message: GameLog): string {
    return (
      `${Object.values(message)
        .map(value => `"${value}"`)
        .join(',')}` + '\r\n'
    );
  }
}
