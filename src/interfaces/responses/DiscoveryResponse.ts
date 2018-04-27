import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId, PlayerId } from '../../common/EntityIds';

export interface TileInfo {
  x: number;
  y: number;
  playerId: PlayerId | null;
  piece: boolean;
  distanceToClosestPiece: number;
}

export interface DiscoveryResponsePayload {
  timestamp: number;
  tiles: TileInfo[];
}

export interface DiscoveryResponse extends MessageWithRecipient<DiscoveryResponsePayload> {
  type: 'DISCOVERY_RESPONSE';
  senderId: GameMasterId;
}
