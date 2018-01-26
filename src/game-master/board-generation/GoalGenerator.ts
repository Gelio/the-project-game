import { Point } from '../../common/Point';
import { BoardSize } from '../../interfaces/BoardSize';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';
import { Tile } from '../models/tiles/Tile';

export class GoalGenerator {
  /**
   * Mutates `tiles` parameter
   */
  public generateGoals(count: number, tiles: Tile[][], boardSize: BoardSize) {
    const positions: Point[] = [];
    for (let i = 0; i < count; i++) {
      let position: Point;
      do {
        position = {
          x: Math.floor(Math.random() * boardSize.x),
          y: Math.floor(Math.random() * boardSize.goalArea)
        };
      } while (
        positions.findIndex(point => point.x === position.x && point.y === position.y) !== -1
      );

      positions.push(position);
    }

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
