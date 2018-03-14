import { MessageWithRecipient } from '../MessageWithRecipient';

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
  currentRound: number;
}

export interface RoundStartedMessage extends MessageWithRecipient<RoundStartedMessagePayload> {
  type: 'ROUND_STARTED';
  senderId: -1;
}
