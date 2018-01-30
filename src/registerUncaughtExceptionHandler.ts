import { LoggerInstance } from 'winston';

export function registerUncaughtExceptionHandler(logger: LoggerInstance) {
  process.on('uncaughtException', error => {
    logger.error(error.message);
    logger.debug(JSON.stringify(error));
  });
}
