import { GameDefinition } from '../interfaces/GameDefinition';

import { Player } from './Player';

export class Game {
  public readonly gameDefinition: GameDefinition;
  public readonly team1Players: Player[] = [];
  public readonly team2Players: Player[] = [];

  public constructor(gameDefinition: GameDefinition) {
    this.gameDefinition = gameDefinition;
  }

  /**
   * Used when game is destroyed because the GM disconnected
   */
  public destroy() {
    this.team1Players.forEach(player => player.destroy());
    this.team2Players.forEach(player => player.destroy());
  }

  public finish() {
    this.team1Players.forEach(player => player.onGameFinished());
    this.team2Players.forEach(player => player.onGameFinished());
  }

  public getPlayersCount() {
    return this.team1Players.length + this.team2Players.length;
  }

  public getGameCapacity() {
    const { teamSizes } = this.gameDefinition;

    return teamSizes['1'] + teamSizes['2'];
  }
}
