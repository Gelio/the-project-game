import { PlayerId } from '../common/EntityIds';

export interface PieceInfo {
  isSham: boolean;
  wasTested: boolean;
}

export interface TileInfo {
  distanceToPiece: number;
  /**
   * `true` when this tile has a completed goal
   * `false` when this tile does not have a goal
   * `undefined` when it is not known if this tile has a goal or not
   */
  hasCompletedGoal: boolean | undefined;
  piece: PieceInfo | null;
  playerId: PlayerId | null;
  timestamp: number;
}

export type BoardInfo = TileInfo[];
