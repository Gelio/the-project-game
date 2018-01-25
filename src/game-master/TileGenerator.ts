import { NeutralAreaTile } from './models/tiles/NeutralAreaTile';
import { TeamAreaTile } from './models/tiles/TeamAreaTile';
import { Tile } from './models/tiles/Tile';

interface TileGeneratorOptions {
  goalAreaHeight: number;
  boardWidth: number;
  taskAreaHeight: number;
}

export class TileGenerator {
  private readonly options: TileGeneratorOptions;

  constructor(options: TileGeneratorOptions) {
    this.options = options;
  }

  public generateTeamAreaTiles(baseY: number) {
    const tiles: Tile[][] = [];

    for (let y = 0; y < this.options.goalAreaHeight; y++) {
      const row: Tile[] = [];
      tiles.push(row);

      for (let x = 0; x < this.options.boardWidth; x++) {
        const tile = new TeamAreaTile(x, y + baseY);
        row.push(tile);
      }
    }

    return tiles;
  }

  public generateNeutralAreaTiles(baseY: number) {
    const tiles: Tile[][] = [];

    for (let y = 0; y < this.options.taskAreaHeight; y++) {
      const row: Tile[] = [];
      tiles.push(row);

      for (let x = 0; x < this.options.boardWidth; x++) {
        const tile = new NeutralAreaTile(x, y + baseY);
        row.push(tile);
      }
    }

    return tiles;
  }
}
