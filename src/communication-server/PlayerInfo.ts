import { PlayerId } from '../common/EntityIds';
import { GameName } from '../common/GameName';
import { TeamId } from '../common/TeamId';

export interface PlayerInfo {
  id: PlayerId;
  gameName: GameName;
  teamId: TeamId;
  isLeader: boolean;
}
