import * as winston from 'winston';

import { UITransport } from './UITransport';

export function createLogger(uiTransport: UITransport): winston.LoggerInstance {
  const typelessWinston: any = winston;

  return typelessWinston.createLogger({
    format: typelessWinston.format.combine(
      typelessWinston.format.json(),
      typelessWinston.format.timestamp()
    ),
    transports: [uiTransport],
    level: 'silly'
  });
}
