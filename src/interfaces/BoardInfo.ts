export interface PieceInfo {
  isSham: boolean;
  wasTested: boolean;
}

export interface TileInfo {
  distanceToPiece: number;
  hasCompletedGoal: boolean;
  piece: PieceInfo | null;
  playerId: number | null;
  timestamp: number;
}

export type BoardInfo = TileInfo[];
