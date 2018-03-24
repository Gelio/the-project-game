import { PlayerRequest } from '../PlayerRequest';

export interface DiscoveryRequest extends PlayerRequest<undefined> {
  type: 'DISCOVERY_REQUEST';
}
