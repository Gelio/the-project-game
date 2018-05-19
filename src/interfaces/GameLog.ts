import { EntityId } from '../common/EntityIds';

export enum role {
  Member = 'member',
  Leader = 'leader'
}

export interface GameLog {
  type: string;
  timestamp: number;
  playerId: EntityId;
  teamId: number;
  round: number;
  role: role;
  valid: number;
}
