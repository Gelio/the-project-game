import { PlayerId } from '../common/EntityIds';

export interface PlayerPosition {
  playerId: PlayerId;
  x: number;
  y: number;
}
