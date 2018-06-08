import { LoggerInstance } from 'winston';

import { UIController } from '../game-master/ui/IUIController';

export function createMockUiController(logger: LoggerInstance): UIController {
  return <any>{
    updateBoard: jest.fn(),
    init: jest.fn(),
    destroy: jest.fn(),
    createLogger: () => logger,
    updateGameInfo: jest.fn()
  };
}
