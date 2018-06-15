import { LoggerInstance } from 'winston';
import { LoggerFactory } from './common/logging/LoggerFactory';
import { registerUncaughtExceptionHandler } from './registerUncaughtExceptionHandler';

describe('registerUncaughtExceptionHandler', () => {
  let logger: LoggerInstance;

  beforeEach(() => {
    const loggerFactory = new LoggerFactory();

    logger = loggerFactory.createEmptyLogger();
  });

  it('should register an uncaught exception handler', () => {
    spyOn(process, 'on');

    registerUncaughtExceptionHandler(logger);

    expect(process.on).toHaveBeenCalled();
  });

  it('should return an unregister callback', () => {
    spyOn(process, 'removeListener');

    const callback = registerUncaughtExceptionHandler(logger);

    callback();

    expect(process.removeListener).toHaveBeenCalled();
  });

  it('should register a handler that logs uncaught exceptions', () => {
    spyOn(logger, 'error');
    registerUncaughtExceptionHandler(logger);

    process.emit('uncaughtException', new Error('test'));

    expect(logger.error).toHaveBeenCalled();
  });
});
