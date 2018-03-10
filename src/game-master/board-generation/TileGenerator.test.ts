import { BoardSize } from '../../interfaces/BoardSize';

import { NeutralAreaTile } from '../models/tiles/NeutralAreaTile';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';

import { TileGenerator } from './TileGenerator';

describe('[GM] TileGenerator', () => {
  let tileGenerator: TileGenerator;
  const boardSize: BoardSize = {
    x: 30,
    goalArea: 5,
    taskArea: 30
  };
  beforeAll(() => {
    tileGenerator = new TileGenerator();
  });

  it('should generate correct board', () => {
    const tiles = tileGenerator.generateBoardTiles(boardSize);

    const gapBetweenTeamTiles = boardSize.taskArea + boardSize.goalArea;

    for (let x = 0; x < boardSize.x; ++x) {
      for (let y = 0; y < boardSize.goalArea; ++y) {
        const firstTeamTile = tiles[x][y];
        const secondTeamTile = tiles[x][y + gapBetweenTeamTiles];
        expect(firstTeamTile).toBeInstanceOf(TeamAreaTile);
        expect(secondTeamTile).toBeInstanceOf(TeamAreaTile);
      }
      for (let y = 0; y < boardSize.taskArea; ++y) {
        expect(tiles[x][y + boardSize.goalArea]).toBeInstanceOf(NeutralAreaTile);
      }
    }
  });
});
