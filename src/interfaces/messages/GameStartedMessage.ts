import { MessageWithRecipient } from '../MessageWithRecipient';
import { TeamInfo } from '../TeamInfo';

import { GameMasterId } from '../../common/EntityIds';

export interface GameStartedMessagePayload {
  teamInfo: {
    '1': TeamInfo;
    '2': TeamInfo;
  };
}

export interface GameStartedMessage extends MessageWithRecipient<GameStartedMessagePayload> {
  type: 'GAME_STARTED';
  senderId: GameMasterId;
}
