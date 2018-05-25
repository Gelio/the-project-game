import { Player } from './Player';
import { PlayersContainer } from './PlayersContainer';

function createPlayerMock(properties: Partial<Player>): Player {
  // NOTE: In case we need to methods on the Player, this should prove itself useful
  // as we can add mocks on the returned object
  return <any>{ ...properties };
}

describe('[GM] PlayersContainer', () => {
  it('should instantiate correctly', () => {
    expect(new PlayersContainer()).toBeDefined();
  });

  describe('addPlayer', () => {
    it('should add the player', () => {
      const container = new PlayersContainer();
      const player = createPlayerMock({});

      container.addPlayer(player);

      expect(container.players).toHaveLength(1);
      expect(container.players[0]).toBe(player);
    });

    it('should throw an error when adding the same player twice', () => {
      const container = new PlayersContainer();
      const player = createPlayerMock({});

      container.addPlayer(player);
      expect(() => container.addPlayer(player)).toThrow();
    });
  });

  describe('removePlayer', () => {
    it('should remove the player', () => {
      const container = new PlayersContainer();
      const player = createPlayerMock({});

      container.addPlayer(player);
      container.removePlayer(player);

      expect(container.players).toHaveLength(0);
    });

    it('should throw an error when removing a player that was not added previously', () => {
      const container = new PlayersContainer();
      const player = createPlayerMock({});

      expect(() => container.removePlayer(player)).toThrow();
    });
  });

  describe('getPlayersFromTeam', () => {
    it('should work when there are no players', () => {
      const container = new PlayersContainer();

      expect(container.getPlayersFromTeam(1)).toHaveLength(0);
      expect(container.getPlayersFromTeam(2)).toHaveLength(0);
    });

    it('should return the players from a specific team', () => {
      const container = new PlayersContainer();

      const players = [
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 2 }),
        createPlayerMock({ teamId: 2 }),
        createPlayerMock({ teamId: 2 })
      ];

      players.forEach(player => container.addPlayer(player));

      const result = container.getPlayersFromTeam(1);
      expect(result).toHaveLength(5);
      expect(result).toContain(players[0]);
      expect(result).toContain(players[4]);
    });

    it('should return an empty array when there are no players from a given team', () => {
      const container = new PlayersContainer();

      const players = [
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 1 }),
        createPlayerMock({ teamId: 1 })
      ];

      players.forEach(player => container.addPlayer(player));

      const result = container.getPlayersFromTeam(2);
      expect(result).toHaveLength(0);
    });
  });

  describe('getPlayerById', () => {
    it('should return undefined when there are no players', () => {
      const container = new PlayersContainer();

      expect(container.getPlayerById('uuid')).toBe(undefined);
    });

    it('should return undefined when the player is not found', () => {
      const container = new PlayersContainer();
      container.addPlayer(createPlayerMock({ playerId: 'uuid' }));

      expect(container.getPlayerById('uuid2')).toBe(undefined);
    });

    it('should return the player with a given ID', () => {
      const container = new PlayersContainer();

      const players = [
        createPlayerMock({ playerId: 'uuid' }),
        createPlayerMock({ playerId: 'uuid2' }),
        createPlayerMock({ playerId: 'uuid3' })
      ];

      players.forEach(player => container.addPlayer(player));

      const result = container.getPlayerById('uuid2');
      expect(result).toBe(players[1]);
    });
  });
});
