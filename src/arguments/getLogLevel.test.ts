import { getLogLevel } from './getLogLevel';

describe('getLogLevel', () => {
  it('should return verbose when verbose flag is set', () => {
    const logLevel = getLogLevel({
      verbose: true,
      log_level: 'error'
    });

    expect(logLevel).toBe('verbose');
  });

  it('should return log level from arguments (error) when verbose is not set', () => {
    const logLevel = getLogLevel({
      verbose: false,
      log_level: 'error'
    });

    expect(logLevel).toBe('error');
  });

  it('should return log level from arguments (debug) when verbose is not set', () => {
    const logLevel = getLogLevel({
      verbose: false,
      log_level: 'debug'
    });

    expect(logLevel).toBe('debug');
  });

  it('should return info as a default log level', () => {
    const logLevel = getLogLevel(<any>{});

    expect(logLevel).toBe('info');
  });
});
