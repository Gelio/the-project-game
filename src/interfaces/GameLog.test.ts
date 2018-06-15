import { GameLog } from './GameLog';
import { Message } from './Message';

import { Player } from '../game-master/Player';

describe('GameLog', () => {
  it('should instantiate correctly', () => {
    const message: Message<any> = {
      type: 'foo',
      senderId: 'p1',
      payload: {}
    };

    const player = new Player();

    const instance = new GameLog(message, player, 1, true, 'abcd');

    expect(instance).toBeDefined();
  });
});
