import { EntityId } from '../common/EntityIds';
import { TeamId } from '../common/TeamId';

import { Message } from './Message';

import { Player } from '../game-master/Player';

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
    message: Message<any>,
    player: Player,
    round: number,
    isValid: boolean,
    timestamp?: string
  ) {
    this.type = message.type;
    this.playerId = player.playerId;
    this.teamId = player.teamId;
    this.role = player.isLeader ? PlayerRole.Leader : PlayerRole.Member;
    this.valid = isValid;
    this.timestamp = timestamp || new Date().toString();
    this.round = round;
  }
}
