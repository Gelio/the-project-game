import { reverseArrayDimensions } from '../../common/reverseArrayDimensions';
import { BoardSize } from '../../interfaces/BoardSize';
import { NeutralAreaTile } from '../models/tiles/NeutralAreaTile';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';
import { Tile } from '../models/tiles/Tile';

export class TileGenerator {
  public generateBoardTiles(boardSize: BoardSize) {
    const team1Tiles = this.generateTeamAreaTiles(boardSize, 0);
    const neutralTiles = this.generateNeutralAreaTiles(boardSize, boardSize.goalArea);
    const team2Tiles = this.generateTeamAreaTiles(
      boardSize,
      boardSize.goalArea + boardSize.taskArea
    );

    const reverseCoordinateTiles = team1Tiles.concat(neutralTiles, team2Tiles);

    return reverseArrayDimensions(reverseCoordinateTiles);
  }

  private generateTeamAreaTiles(boardSize: BoardSize, baseY: number) {
    const tiles: Tile[][] = [];

    for (let y = 0; y < boardSize.goalArea; y++) {
      const row: Tile[] = [];
      tiles.push(row);

      for (let x = 0; x < boardSize.x; x++) {
        const tile = new TeamAreaTile(x, y + baseY);
        row.push(tile);
      }
    }

    return tiles;
  }

  private generateNeutralAreaTiles(boardSize: BoardSize, baseY: number) {
    const tiles: Tile[][] = [];

    for (let y = 0; y < boardSize.taskArea; y++) {
      const row: Tile[] = [];
      tiles.push(row);

      for (let x = 0; x < boardSize.x; x++) {
        const tile = new NeutralAreaTile(x, y + baseY);
        row.push(tile);
      }
    }

    return tiles;
  }
}
