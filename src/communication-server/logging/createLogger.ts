import * as winston from 'winston';

export function createLogger(): winston.LoggerInstance {
  const typelessWinston: any = winston;

  return typelessWinston.createLogger({
    format: typelessWinston.format.combine(
      typelessWinston.format.timestamp(),
      typelessWinston.format.prettyPrint()
    ),
    transports: [new winston.transports.Console()],
    level: 'silly'
  });
}
