import { NPMLoggingLevel, Transport } from 'winston';

interface LogInfo {
  [label: string]: any;
  level: NPMLoggingLevel;
  timestamp: string;
  message: string;
}

type LogFunction = (message: string) => void;

export class UITransport extends Transport {
  private readonly logFunction: LogFunction;
  private readonly levelColor: { [level: string]: string } = {
    error: '{red-fg}{bold}{underline}',
    warn: '{yellow-fg}{bold}',
    info: '{blue-fg}',
    verbose: '{green-fg}',
    debug: '{cyan-fg}',
    silly: '{white-fg}'
  };
  private readonly defaultLevelColor: '{white-fg}';

  constructor(logFunction: LogFunction) {
    super();

    this.logFunction = logFunction;
  }

  public log(info: LogInfo, callback?: Function) {
    const logEntry = this.formatLogEntry(info);
    this.logFunction(logEntry);

    if (callback) {
      callback();
    }
  }

  private formatLogEntry(info: LogInfo) {
    const levelColor = this.levelColor[info.level] || this.defaultLevelColor;

    return `${info.timestamp} [${levelColor}${info.level}{/}]: ${info.message}`;
  }
}
