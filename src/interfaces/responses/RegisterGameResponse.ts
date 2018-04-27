import { MessageWithRecipient } from '../MessageWithRecipient';

import { CommunicationServerId, GameMasterId } from '../../common/EntityIds';

interface RegisterGameResponsePayload {
  registered: boolean;
}

export interface RegisterGameResponse extends MessageWithRecipient<RegisterGameResponsePayload> {
  type: 'REGISTER_GAME_RESPONSE';
  senderId: CommunicationServerId;
  recipientId: GameMasterId;
}
