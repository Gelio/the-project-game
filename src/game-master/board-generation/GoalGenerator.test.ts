import { BoardSize } from '../../interfaces/BoardSize';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';
import { GoalGenerator } from './GoalGenerator';
import { TileGenerator } from './TileGenerator';

describe('[GM] GoalGenerator', () => {
  let tileGenerator: TileGenerator;
  let goalGenerator: GoalGenerator;
  const boardSize: BoardSize = {
    x: 30,
    goalArea: 5,
    taskArea: 30
  };
  beforeAll(() => {
    tileGenerator = new TileGenerator();
    goalGenerator = new GoalGenerator();
  });

  it('check if there are correct numbers of goals in area of each team', () => {
    const pointsLimit = 10;
    const tiles = tileGenerator.generateBoardTiles(boardSize);
    goalGenerator.generateGoals(pointsLimit, tiles, boardSize);
    const gapBetweenTeamTiles = boardSize.taskArea + boardSize.goalArea;
    let firstTeamGoalsCount = 0;
    let secondTeamGoasCount = 0;

    for (let x = 0; x < boardSize.x; ++x) {
      for (let y = 0; y < boardSize.goalArea; ++y) {
        {
          const firstTeamTile = <TeamAreaTile>tiles[x][y];
          const secondTeamTile = <TeamAreaTile>tiles[x][y + gapBetweenTeamTiles];
          if (firstTeamTile.hasGoal) {
            firstTeamGoalsCount++;
          }
          if (secondTeamTile.hasGoal) {
            secondTeamGoasCount++;
          }
        }
      }
    }
    expect(firstTeamGoalsCount).toBe(pointsLimit);
    expect(secondTeamGoasCount).toBe(pointsLimit);
  });
});
