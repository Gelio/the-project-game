import { Message } from './Message';

import { PlayerId } from '../common/EntityIds';

export interface PlayerRequest<T> extends Message<T> {
  senderId: PlayerId;
}
