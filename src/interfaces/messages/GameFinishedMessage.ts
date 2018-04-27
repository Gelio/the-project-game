import { MessageWithRecipient } from '../MessageWithRecipient';

import { GameMasterId } from '../../common/EntityIds';

export interface GameFinishedMessagePayload {
  team1Score: number;
  team2Score: number;
}

export interface GameFinishedMessage extends MessageWithRecipient<GameFinishedMessagePayload> {
  type: 'GAME_FINISHED';
  senderId: GameMasterId;
}
