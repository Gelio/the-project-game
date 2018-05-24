import { PlayersContainer } from '../PlayersContainer';

import { GameStartedMessagePayload } from '../../interfaces/messages/GameStartedMessage';

export function getGameStartedMessagePayload(
  playersContainer: PlayersContainer
): GameStartedMessagePayload {
  const team1Players = playersContainer.getPlayersFromTeam(1);
  const team2Players = playersContainer.getPlayersFromTeam(2);
  const team1Leader = team1Players.find(player => player.isLeader);
  const team2Leader = team2Players.find(player => player.isLeader);

  if (!team1Leader || !team2Leader) {
    throw new Error('Game cannot start without both leaders');
  }

  return {
    teamInfo: {
      1: {
        players: team1Players.map(player => player.playerId),
        leaderId: team1Leader.playerId
      },
      2: {
        players: team2Players.map(player => player.playerId),
        leaderId: team2Leader.playerId
      }
    }
  };
}
