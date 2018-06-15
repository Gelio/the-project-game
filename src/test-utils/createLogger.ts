import { LoggerInstance } from 'winston';

export function createLogger(): LoggerInstance {
  return <any>{
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
    error: jest.fn()
  };
}
