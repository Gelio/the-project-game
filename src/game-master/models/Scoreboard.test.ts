import { Scoreboard } from './Scoreboard';

describe('[GM] Scoreboard', () => {
  it('should instantiate correctly', () => {
    expect(new Scoreboard(5)).toBeDefined();
  });

  it('should have the score limit as provided in the constructor', () => {
    const scoreboard = new Scoreboard(5);

    expect(scoreboard.scoreLimit).toBe(5);
  });

  it('should initialize team scores to 0', () => {
    const scoreboard = new Scoreboard(5);

    expect(scoreboard.team1Score).toBe(0);
    expect(scoreboard.team2Score).toBe(0);
  });
});
