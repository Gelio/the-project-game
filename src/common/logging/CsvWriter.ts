import * as fs from 'fs';

import { GameLog } from '../../interfaces/GameLog';

export class CsvWriter {
  private readonly fileName: string;

  constructor(gameName: string) {
    this.fileName = `${gameName}.csv`;
    if (fs.existsSync(this.fileName)) {
      fs.renameSync(this.fileName, `${this.fileName}.${Date.now()}`);
    }

    const gameLog = {
      type: null,
      timestamp: null,
      playerId: null,
      teamId: null,
      round: null,
      role: null,
      valid: null
    };
    let headers = `${Object.keys(gameLog)
      .map(header => `"${header}"`)
      .join(',')}`;
    headers += '\r\n';

    fs.writeFileSync(this.fileName, headers);
  }

  public logMessage(message: GameLog) {
    fs.appendFileSync(this.fileName, this.convertToCsvFormat(message));
  }

  private convertToCsvFormat(message: GameLog): string {
    let converted = `${(<any>Object)
      .values(message)
      .map((property: any) => `"${property}"`)
      .join(',')}`;
    converted += '\r\n';

    return converted;
  }
}
