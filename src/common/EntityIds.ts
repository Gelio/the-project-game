export type PlayerId = string;
export type GameMasterId = 'GAME_MASTER';
export type CommunicationServerId = 'COMMUNICATION_SERVER';

export type EntityId = PlayerId | GameMasterId | CommunicationServerId;

export const GAME_MASTER_ID: GameMasterId = 'GAME_MASTER';
export const COMMUNICATION_SERVER_ID: CommunicationServerId = 'COMMUNICATION_SERVER';
