import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface ActionInvalidMessage extends MessageWithRecipient<{ reason: string }> {
  type: 'ACTION_INVALID';
  senderId: GameMasterId;
}
