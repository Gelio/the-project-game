import { Player } from './Player';
import { TeamId } from '../common/TeamId';

export class PlayersContainer {
  public readonly players: Player[] = [];

  public addPlayer(player: Player) {
    if (this.players.indexOf(player) !== -1) {
      throw new Error('Player already added');
    }
    this.players.push(player);
  }

  public removePlayer(player: Player) {
    const playerIndex = this.players.indexOf(player);
    if (playerIndex === -1) {
      throw new Error('Player is not added');
    }
    this.players.splice(playerIndex, 1);
  }

  public getPlayersFromTeam(teamId: TeamId) {
    return this.players.filter(player => player.teamId === teamId);
  }

  public getConnectedPlayers() {
    return this.players.filter(player => player.isConnected);
  }

  public getPlayerById(playerId: number) {
    return this.players.find(player => player.playerId === playerId);
  }
}
