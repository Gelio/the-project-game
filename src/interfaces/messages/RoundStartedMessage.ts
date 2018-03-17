import { MessageWithRecipient } from '../MessageWithRecipient';
import { TeamInfo } from '../TeamInfo';

export interface RoundStartedMessagePayload {
  currentRound: number;
  teamInfo: {
    '1': TeamInfo;
    '2': TeamInfo;
  };
}

export interface RoundStartedMessage extends MessageWithRecipient<RoundStartedMessagePayload> {
  type: 'ROUND_STARTED';
  senderId: -1;
}
