import { Player } from './Player';

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
}
