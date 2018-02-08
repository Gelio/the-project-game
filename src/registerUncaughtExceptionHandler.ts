import { LoggerInstance } from 'winston';

export function registerUncaughtExceptionHandler(logger: LoggerInstance) {
  const callback = (error: Error) => {
    logger.error(error.message, error);

    const serializedError = JSON.stringify(error);
    if (serializedError !== '{}') {
      logger.debug(serializedError);
    }
  };

  process.on('uncaughtException', callback);

  return () => process.removeListener('uncaughtException', callback);
}
