import { MessageWithRecipient } from '../MessageWithRecipient';

export interface TileInfo {
  x: number;
  y: number;
  playerId: number | null;
  piece: boolean;
  distanceToClosestPiece: number;
}

export interface DiscoveryResponsePayload {
  timestamp: number;
  tiles: TileInfo[];
}

export interface DiscoveryResponse extends MessageWithRecipient<DiscoveryResponsePayload> {
  type: 'DISCOVERY_RESPONSE';
  senderId: -1;
}
