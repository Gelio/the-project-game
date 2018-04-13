import { PlayerIdGenerator } from './PlayerIdGenerator';

const TESTS_COUNT = 10000;

describe('[CS] PlayerIdGenerator', () => {
  it('should instantiate correctly', () => {
    expect(new PlayerIdGenerator()).toBeDefined();
  });

  describe('getNextPlayerId', () => {
    it('should generate IDs greater than 0', () => {
      const generator = new PlayerIdGenerator();

      for (let i = 0; i < TESTS_COUNT; i++) {
        expect(generator.getNextPlayerId()).toBeGreaterThan(0);
      }
    });

    it('should not repeat the IDs', () => {
      const generator = new PlayerIdGenerator();
      const generatedIds = [];

      for (let i = 0; i < TESTS_COUNT; i++) {
        const id = generator.getNextPlayerId();
        expect(generatedIds).not.toContain(id);
        generatedIds.push(id);
      }
    });
  });
});
