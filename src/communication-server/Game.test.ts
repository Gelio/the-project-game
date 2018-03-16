import { Game } from './Game';

describe('[CS] Game', () => {
  describe('destroy', () => {
    it('should call destroy on each player from team1', () => {
      const game = new Game(<any>{});
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const fn3 = jest.fn();
      const fn4 = jest.fn();

      game.team1Players.push(<any>{
        destroy: fn1
      });
      game.team1Players.push(<any>{
        destroy: fn2
      });
      game.team2Players.push(<any>{
        destroy: fn3
      });
      game.team2Players.push(<any>{
        destroy: fn4
      });

      game.destroy();

      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
      expect(fn3).toHaveBeenCalledTimes(1);
      expect(fn4).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPlayersCount', () => {
    it('should sum the number of players', () => {
      const game = new Game(<any>{});

      game.team1Players.push(<any>{});
      game.team1Players.push(<any>{});
      game.team2Players.push(<any>{});

      expect(game.getPlayersCount()).toEqual(3);
    });
  });

  describe('getGameCapacity', () => {
    it('should sum the team sizes', () => {
      const game = new Game(<any>{
        teamSizes: {
          1: 2,
          2: 5
        }
      });

      expect(game.getGameCapacity()).toEqual(7);
    });
  });
});
