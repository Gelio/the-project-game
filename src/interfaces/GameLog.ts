import { EntityId } from '../common/EntityIds';
import { TeamId } from '../common/TeamId';

import { Message } from './Message';

import { Player } from '../game-master/Player';

export enum PlayerRole {
  Member = 'member',
  Leader = 'leader'
}

export class GameLog {
  public readonly messageType: string;
  public readonly timestamp: string;
  public readonly playerId: EntityId;
  public readonly teamId: TeamId;
  public readonly round: number;
  public readonly playerRole: PlayerRole;
  public readonly valid: boolean;

  constructor(
    message: Message<any>,
    player: Player,
    round: number,
    isValid: boolean,
    timestamp?: string
  ) {
    this.messageType = message.type;
    this.playerId = player.playerId;
    this.teamId = player.teamId;
    this.playerRole = player.isLeader ? PlayerRole.Leader : PlayerRole.Member;
    this.valid = isValid;
    this.timestamp = timestamp || new Date().toString();
    this.round = round;
  }
}
