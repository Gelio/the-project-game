import { MessageWithRecipient } from '../MessageWithRecipient';

import { CommunicationServerId, GameMasterId } from '../../common/EntityIds';

export interface UnregisterGameResponsePayload {
  unregistered: boolean;
}

export interface UnregisterGameResponse
  extends MessageWithRecipient<UnregisterGameResponsePayload> {
  type: 'UNREGISTER_GAME_RESPONSE';
  senderId: CommunicationServerId;
  recipientId: GameMasterId;
}
