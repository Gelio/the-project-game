import { arrayShuffle } from '../../common/arrayShuffle';

import { Point } from '../../common/Point';
import { BoardSize } from '../../interfaces/BoardSize';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';
import { Tile } from '../models/tiles/Tile';
export class GoalGenerator {
  /**
   * Mutates `tiles` parameter
   */
  public generateGoals(count: number, tiles: Tile[][], boardSize: BoardSize) {
    const allPositions: Point[] = [];
    for (let y = 0; y < boardSize.goalArea; ++y) {
      for (let x = 0; x < boardSize.x; ++x) {
        allPositions.push(new Point(x, y));
      }
    }
    arrayShuffle(allPositions);

    const positions = allPositions.slice(count);

    const boardWidth = boardSize.x;
    const boardHeight = boardSize.taskArea + boardSize.goalArea * 2;
    positions.forEach(position => {
      // Team 1
      const team1Tile = <TeamAreaTile>tiles[position.x][position.y];
      team1Tile.hasGoal = true;

      // Team 2
      const team2Tile = <TeamAreaTile>tiles[boardWidth - 1 - position.x][
        boardHeight - 1 - position.y
      ];
      team2Tile.hasGoal = true;
    });
  }
}
