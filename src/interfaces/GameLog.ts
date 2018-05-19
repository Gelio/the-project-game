import { EntityId } from '../common/EntityIds';

export enum role {
  Member = 'member',
  Leader = 'leader'
}

export interface GameLog {
  type: string;
  senderId: EntityId;
  teamId: number;
  timestamp: number;
  round: number;
  role: role;
  valid: validity;
}
