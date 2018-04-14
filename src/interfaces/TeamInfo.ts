import { PlayerId } from '../common/EntityIds';

export interface TeamInfo {
  /**
   * Player IDs
   */
  players: PlayerId[];

  /**
   * Team Leader's ID
   */
  leaderId: PlayerId;
}
