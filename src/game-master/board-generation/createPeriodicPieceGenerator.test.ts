import { createPeriodicPieceGenerator } from './createPeriodicPieceGenerator';
import { PeriodicPieceGenerator } from './PeriodicPieceGenerator';

describe('[GM] createPeriodicPieceGenerator', () => {
  it('should instantiate PeriodicPieceGenerator', () => {
    const factory = createPeriodicPieceGenerator(
      {
        checkInterval: 10,
        piecesLimit: 20,
        shamChance: 0.5
      },
      <any>{}
    );

    const generator = factory(<any>{});

    expect(generator).toBeInstanceOf(PeriodicPieceGenerator);
  });
});
