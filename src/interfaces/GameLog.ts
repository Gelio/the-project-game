import { EntityId } from '../common/EntityIds';
import { TeamId } from '../common/TeamId';

export enum PlayerRole {
  Member = 'member',
  Leader = 'leader'
}

export class GameLog {
  public readonly type: string;
  public readonly timestamp: string;
  public readonly playerId: EntityId;
  public readonly teamId: TeamId;
  public readonly round: number;
  public readonly role: PlayerRole;
  public readonly valid: boolean;

  constructor(
    type: string,
    timestamp: string,
    playerId: EntityId,
    teamId: TeamId,
    round: number,
    role: PlayerRole,
    valid: boolean
  ) {
    this.teamId = teamId;
    this.type = type;
    this.valid = valid;
    this.timestamp = timestamp;
    this.playerId = playerId;
    this.round = round;
    this.role = role;
  }
}
