import { Point } from '../../common/Point';
import { BoardSize } from '../../interfaces/BoardSize';
import { Player } from '../Player';
import { Piece } from './Piece';
import { Tile } from './tiles/Tile';

export class Board {
  public readonly size: BoardSize;
  public readonly tiles: Tile[][];
  public readonly pieces: Piece[] = [];

  constructor(size: BoardSize, tiles: Tile[][]) {
    this.size = size;
    this.tiles = tiles;
  }

  public reset() {
    // TODO: implement this
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

  public addPlayer(player: Player) {
    this.getTileAtPosition(player.position).player = player;
  }

  public removePlayer(point: Point) {
    this.tiles[point.x][point.y].player = null;
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
}
