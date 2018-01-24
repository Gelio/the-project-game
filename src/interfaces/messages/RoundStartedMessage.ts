import { MessageWithRecipient } from '../MessageWithRecipient';

import { ActionDelays } from '../ActionDelays';
import { BoardSize } from '../BoardSize';

export interface TeamInfo {
  /**
   * Player IDs
   */
  players: number[];

  /**
   * Team Leader's ID
   */
  leaderId: number;
}

export interface RoundStartedMessagePayload {
  teams: {
    '1': TeamInfo;
    '2': TeamInfo;
  };
  boardSize: BoardSize;
  maxRounds: number;
  currentRound: number;
  goalLimit: number;
  delays: ActionDelays;
}

export interface RoundStartedMessage extends MessageWithRecipient<RoundStartedMessagePayload> {
  type: 'ROUND_STARTED';
  senderId: -1;
}
