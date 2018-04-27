import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface ActionValidMessage extends MessageWithRecipient<{ delay: number }> {
  type: 'ACTION_VALID';
  senderId: GameMasterId;
}
