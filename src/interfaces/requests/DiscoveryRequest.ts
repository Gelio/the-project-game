import { Message } from '../Message';

export interface DiscoveryPieceRequest extends Message<undefined> {
  type: 'DISCOVERY_REQUEST';
}
