import { arrayShuffle } from '../../common/arrayShuffle';
import { Point } from '../../common/Point';
import { TeamId } from '../../common/TeamId';

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

  public tiles: Tile[][] = [];
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

  public getTileTeamId(teamTile: Tile): TeamId {
    if (
      this.firstTeamPositions.find(
        position => position.x === teamTile.x && position.y === teamTile.y
      )
    ) {
      return 1;
    }
    if (
      this.secondTeamPositions.find(
        position => position.x === teamTile.x && position.y === teamTile.y
      )
    ) {
      return 2;
    }

    throw new Error('The tile is not a team tile');
  }

  public addPlayer(player: Player) {
    if (player.position) {
      throw new Error('Player is already added on board');
    }

    this.setRandomPlayerPosition(player);
  }

  public removePlayer(player: Player) {
    if (!player.position) {
      return;
    }

    this.tiles[player.position.x][player.position.y].player = null;
    player.position = null;
  }

  public movePlayer(player: Player, newPosition: Point) {
    if (!player.position) {
      throw new Error('Player position is null');
    }

    const previousTile = this.getTileAtPosition(player.position);
    const newTile = this.getTileAtPosition(newPosition);

    if (previousTile.player !== player) {
      throw new Error('Old player position corrupted');
    }

    if (newTile.player && newTile.player !== player) {
      throw new Error('Two players cannot stand on the same tile');
    }

    previousTile.player = null;
    newTile.player = player;
    player.position = newPosition;
  }

  public addPiece(piece: Piece) {
    if (this.pieces.indexOf(piece) !== -1) {
      throw new Error('Piece already added');
    }

    const tile = this.getTileAtPosition(piece.position);
    if (tile.piece) {
      throw new Error('Piece already exists at that position');
    }

    if (!piece.isPickedUp) {
      tile.piece = piece;
    }
    this.pieces.push(piece);
  }

  public removePiece(piece: Piece) {
    const index = this.pieces.indexOf(piece);
    if (index === -1) {
      throw new Error('Piece was not on board');
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
    if (player.position) {
      this.getTileAtPosition(player.position).player = null;
      player.position = null;
    }
    arrayShuffle(possiblePositions);

    for (const position of possiblePositions) {
      if (!this.getTileAtPosition(position).player) {
        player.position = position;
        this.getTileAtPosition(position).player = player;
        break;
      }
    }

    if (!player.position) {
      throw new Error('No free position for player');
    }

    this.getTileAtPosition(player.position).player = player;
  }

  public getDistanceToClosestPiece(tilePosition: Point): number {
    // TODO: test the logic below
    const piecesLayingOnBoard = this.pieces.filter(piece => !piece.isPickedUp);

    if (piecesLayingOnBoard.length === 0) {
      return -1;
    }

    return piecesLayingOnBoard.reduce(
      (minDistance, piece) =>
        Math.min(Point.manhattanDistance(tilePosition, piece.position), minDistance),
      Infinity
    );
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
