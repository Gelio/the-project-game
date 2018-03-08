import { LoggerInstance } from 'winston';

export function registerUncaughtExceptionHandler(logger: LoggerInstance) {
  const callback = (error: Error) => {
    logger.error(error.message, error);
    logger.debug(<string>error.stack);
  };

  process.on('uncaughtException', callback);

  return () => process.removeListener('uncaughtException', callback);
}
