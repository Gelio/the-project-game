import { LoggerInstance } from 'winston';

export function registerUncaughtExceptionHandler(logger: LoggerInstance) {
  process.on('uncaughtException', error => {
    logger.error(error.message, error);

    const serializedError = JSON.stringify(error);
    if (serializedError !== '{}') {
      logger.debug(serializedError);
    }
  });
}
