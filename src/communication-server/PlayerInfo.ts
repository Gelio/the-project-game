import { TeamId } from '../common/TeamId';

export interface PlayerInfo {
  id: number;
  gameName: string;
  teamId: TeamId;
  isLeader: boolean;
}
