import { Stream } from 'stream';
import * as winston from 'winston';

const typelessWinston: any = winston;

export class LoggerFactory {
  public logLevel: winston.NPMLoggingLevel = 'silly';

  public createLogger(transports: winston.TransportInstance[]): winston.LoggerInstance {
    const format = typelessWinston.format;

    return typelessWinston.createLogger({
      format: format.timestamp(),
      transports,
      level: this.logLevel
    });
  }

  public createConsoleLogger(): winston.LoggerInstance {
    const format = typelessWinston.format;

    const consoleTransport = new winston.transports.Console(<any>{
      format: format.combine(
        format.colorize(),
        format.align(),
        format.printf((info: any) => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    });

    return this.createLogger([consoleTransport]);
  }

  public createEmptyLogger(): winston.LoggerInstance {
    const emptyStreamTransport = new typelessWinston.transports.Stream({
      silent: true,
      stream: new Stream.Writable({ objectMode: true, write: () => null })
    });

    return this.createLogger([emptyStreamTransport]);
  }
}
