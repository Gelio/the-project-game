import { EntityId } from '../common/EntityIds';

enum role {
  Member = 'member',
  Leader = 'leader'
}

enum validity {
  invalid = 0,
  valid = 1
}

enum teamId {
  First = 0,
  Second = 1
}

export interface GameLog {
  type: string;
  senderId: EntityId;
  teamId: teamId;
  timestamp: number;
  round: number;
  role: role;
  valid: validity;
}
