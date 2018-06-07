import { TeamId } from '../../common/TeamId';

import { GameMasterOptions } from '../../game-master/GameMaster';

import { PlayerHelloMessage } from '../../interfaces/messages/PlayerHelloMessage';

export function getPlayerHelloMessage(
  gameMasterOptions: GameMasterOptions,
  senderId: string,
  isLeader: boolean,
  teamId: TeamId
): PlayerHelloMessage {
  return {
    type: 'PLAYER_HELLO',
    senderId,
    payload: {
      game: gameMasterOptions.gameName,
      teamId,
      isLeader
    }
  };
}
