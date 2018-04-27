import { EventEmitter } from 'events';

import { Communicator } from './Communicator';

export function createMockCommunicator(): Communicator {
  const communicator: Communicator = <any>new EventEmitter();

  communicator.bindListeners = jest.fn();
  communicator.destroy = jest.fn();
  communicator.sendMessage = jest.fn();

  return communicator;
}
