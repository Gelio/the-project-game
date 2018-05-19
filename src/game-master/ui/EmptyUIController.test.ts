import { EmptyUIController } from './EmptyUIController';

import { LoggerFactory } from '../../common/logging/LoggerFactory';

describe('[GM] EmptyUIController', () => {
  let loggerFactory: LoggerFactory;

  beforeEach(() => {
    loggerFactory = new LoggerFactory();
    loggerFactory.logLevel = 'error';
  });

  it('should instantiate correctly', () => {
    const instance = new EmptyUIController(loggerFactory);

    expect(instance).toBeDefined();
  });

  describe('createLogger', () => {
    it('should create a logger', () => {
      const uiController = new EmptyUIController(loggerFactory);

      const logger = uiController.createLogger();

      expect(logger).toBeDefined();
    });
  });
});
