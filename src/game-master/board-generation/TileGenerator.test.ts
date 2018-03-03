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

  it('check if there are correct numbers of each tile type', () => {
    const tiles = tileGenerator.generateBoardTiles(boardSize);

    const gapBetweenTeamTiles = boardSize.taskArea + boardSize.goalArea;
    let teamAreaTiles = 0;
    let taskAreaTiles = 0;

    for (let x = 0; x < boardSize.x; ++x) {
      for (let y = 0; y < boardSize.goalArea; ++y) {
        {
          const firstTeamTile = tiles[x][y];
          const secondTeamTile = tiles[x][y + gapBetweenTeamTiles];
          if (<TeamAreaTile>firstTeamTile && <TeamAreaTile>secondTeamTile) {
            teamAreaTiles++;
          } else {
            throw new Error('Wrong tile type in team area!');
          }
        }
      }
      for (let y = 0; y < boardSize.taskArea; ++y) {
        if (<NeutralAreaTile>tiles[x][y + boardSize.goalArea]) {
          taskAreaTiles++;
        } else {
          throw new Error('Wrong tile type in task area');
        }
      }
    }
    expect(teamAreaTiles).toBe(boardSize.x * boardSize.goalArea);
    expect(taskAreaTiles).toBe(boardSize.x * boardSize.taskArea);
  });
});
