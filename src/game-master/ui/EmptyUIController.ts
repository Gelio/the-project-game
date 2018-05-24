import { Service } from '../../interfaces/Service';

import { UIController as IUIController } from './IUIController';

import { LoggerFactory } from '../../common/logging/LoggerFactory';

export class EmptyUIController implements Service, IUIController {
  private readonly loggerFactory: LoggerFactory;

  constructor(loggerFactory: LoggerFactory) {
    this.loggerFactory = loggerFactory;
  }

  public init() {
    // Left empty intentionally
  }

  public destroy() {
    // Left empty intentionally
  }

  public render() {
    // Left empty intentionally
  }

  public updateBoard() {
    // Left empty intentionally
  }

  public updateGameInfo() {
    // Left empty intentionally
  }

  public createLogger() {
    return this.loggerFactory.createConsoleLogger();
  }
}
