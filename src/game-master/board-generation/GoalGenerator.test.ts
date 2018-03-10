import { BoardSize } from '../../interfaces/BoardSize';

import { NeutralAreaTile } from '../models/tiles/NeutralAreaTile';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';
import { Tile } from '../models/tiles/Tile';

import { GoalGenerator } from './GoalGenerator';

describe('[GM] GoalGenerator', () => {
  let tiles: Tile[][] = [];
  let goalGenerator: GoalGenerator;
  const boardSize: BoardSize = {
    x: 30,
    goalArea: 5,
    taskArea: 30
  };

  beforeEach(() => {
    tiles = [];
    for (let i = 0; i < boardSize.x; ++i) {
      tiles[i] = [];
      for (let j = 0; j < boardSize.goalArea; ++j) {
        tiles[i].push(new TeamAreaTile(i, j));
      }
      for (let j = 0; j < boardSize.taskArea; ++j) {
        tiles[i].push(new NeutralAreaTile(i, j + boardSize.goalArea));
      }
      for (let j = 0; j < boardSize.goalArea; ++j) {
        tiles[i].push(new TeamAreaTile(i, j + boardSize.goalArea + boardSize.taskArea));
      }
    }
    goalGenerator = new GoalGenerator();
  });

  it('should generate an equal number of goals for each team', () => {
    const pointsLimit = 10;
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
