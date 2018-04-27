import { MessageWithRecipient } from '../MessageWithRecipient';

import { CommunicationServerId, GameMasterId } from '../../common/EntityIds';

export interface UnregisterGameRequestPayload {
  gameName: string;
}

export interface UnregisterGameRequest extends MessageWithRecipient<UnregisterGameRequestPayload> {
  type: 'UNREGISTER_GAME_REQUEST';
  senderId: GameMasterId;
  recipientId: CommunicationServerId;
}
