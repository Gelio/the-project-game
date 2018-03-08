import { arrayShuffle } from '../../common/arrayShuffle';

import { Point } from '../../common/Point';
import { BoardSize } from '../../interfaces/BoardSize';
import { Player } from '../Player';
import { Piece } from './Piece';
import { Tile } from './tiles/Tile';

import { GoalGenerator } from '../board-generation/GoalGenerator';
import { TileGenerator } from '../board-generation/TileGenerator';

export class Board {
  public readonly size: BoardSize;
  public readonly pieces: Piece[] = [];
  public readonly pointsLimit: number;

  private tiles: Tile[][] = [];
  private firstTeamPositions: Point[] = [];
  private secondTeamPositions: Point[] = [];

  constructor(size: BoardSize, pointsLimit: number) {
    this.size = size;
    this.pointsLimit = pointsLimit;
    this.generatePossibleTeamPositions();
    this.generateBoard();
  }

  public reset() {
    this.generateBoard();
  }

  public getTileAtPosition(position: Point) {
    const tileColumn = this.tiles[position.x];
    if (!tileColumn) {
      throw new Error('Invalid X coordinate');
    }

    const tile = tileColumn[position.y];
    if (!tile) {
      throw new Error('Invalid Y coordinate');
    }

    return tile;
  }

  public getTilesCopy() {
    return [...this.tiles];
  }

  public addPlayer(player: Player) {
    this.setRandomPlayerPosition(player);
    this.getTileAtPosition(player.position).player = player;
  }

  public removePlayer(player: Player) {
    this.tiles[player.position.x][player.position.y].player = null;
  }

  public movePlayer(player: Player, newPosition: Point) {
    const previousTile = this.getTileAtPosition(player.position);
    const newTile = this.getTileAtPosition(newPosition);

    if (previousTile.player !== player) {
      throw new Error('Old player position corrupted');
    }

    if (newTile.player) {
      throw new Error('Two players cannot stand on the same tile');
    }

    previousTile.player = null;
    newTile.player = player;
  }

  public addPiece(piece: Piece) {
    if (this.pieces.indexOf(piece) !== -1) {
      throw new Error('Piece already added');
    }

    const tile = this.getTileAtPosition(piece.position);
    if (tile.piece) {
      throw new Error('Piece already exists at that position');
    }

    tile.piece = piece;
    this.pieces.push(piece);
  }

  public removePiece(piece: Piece) {
    const index = this.pieces.indexOf(piece);
    if (index === -1) {
      throw new Error('Piece has not been added to the game previously');
    }

    this.pieces.splice(index, 1);

    if (!piece.isPickedUp) {
      const tile = this.getTileAtPosition(piece.position);
      tile.piece = null;
    }
  }

  public movePiece(piece: Piece, newPosition: Point) {
    const index = this.pieces.indexOf(piece);
    if (index === -1) {
      throw new Error('Piece has not been added to the game previously');
    }

    const previousTile = this.getTileAtPosition(piece.position);
    const newTile = this.getTileAtPosition(newPosition);

    if (previousTile.piece !== piece) {
      throw new Error('Old piece position corrupted');
    }

    if (newTile.piece) {
      throw new Error('Cannot move a piece on a tile which already has one');
    }

    previousTile.piece = null;
    newTile.piece = piece;
    piece.position = newPosition;
  }

  public setRandomPlayerPosition(player: Player) {
    let possiblePositions = this.firstTeamPositions;
    if (player.teamId === 2) {
      possiblePositions = this.secondTeamPositions;
    }

    for (const position of possiblePositions) {
      if (!this.getTileAtPosition(position).player) {
        player.position = position;
        break;
      }
    }
  }

  private generateBoard() {
    const tileGenerator = new TileGenerator();
    const tiles = tileGenerator.generateBoardTiles(this.size);
    const goalGenerator = new GoalGenerator();
    goalGenerator.generateGoals(this.pointsLimit, tiles, this.size);
    this.tiles = tiles;
  }

  private generatePossibleTeamPositions() {
    const gapBetweenTeamTiles = this.size.taskArea + this.size.goalArea;
    this.firstTeamPositions = [];
    this.secondTeamPositions = [];
    for (let y = 0; y < this.size.goalArea; ++y) {
      for (let x = 0; x < this.size.x; ++x) {
        this.firstTeamPositions.push(new Point(x, y));
        this.secondTeamPositions.push(new Point(x, y + gapBetweenTeamTiles));
      }
    }
    arrayShuffle(this.firstTeamPositions);
    arrayShuffle(this.secondTeamPositions);
  }
}
