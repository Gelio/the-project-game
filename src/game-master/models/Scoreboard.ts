export class Scoreboard {
  public team1Score: number;
  public team2Score: number;
  public readonly scoreLimit: number;

  constructor(scoreLimit: number) {
    this.scoreLimit = scoreLimit;
    this.team1Score = 0;
    this.team2Score = 0;
  }
}
