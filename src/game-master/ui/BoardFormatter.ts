import { Piece } from '../models/Piece';
import { NeutralAreaTile } from '../models/tiles/NeutralAreaTile';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';

import { Player } from '../Player';

import { BoardSize } from '../../interfaces/BoardSize';

export class BoardFormatter {
  public displayTile(boardSize: BoardSize, tile: NeutralAreaTile | TeamAreaTile): string {
    if (tile.player) {
      return this.displayPlayer(tile.player);
    }

    if (tile.piece) {
      return this.displayPiece(tile.piece);
    }

    if (tile instanceof NeutralAreaTile) {
      return ' ';
    } else if (tile instanceof TeamAreaTile) {
      return this.displayTeamAreaTile(boardSize, tile);
    }

    throw new Error('Unknown tile');
  }

  private displayPlayer(player: Player): string {
    if (player.teamId === 1) {
      return '{blue-fg}{white-bg}P{/}';
    } else {
      return '{red-fg}{white-bg}P{/}';
    }
  }

  private displayPiece(piece: Piece): string {
    if (piece.isSham) {
      return '{grey-fg}X{/}';
    }

    return '{yellow-fg}X{/}';
  }

  private displayTeamAreaTile(boardSize: BoardSize, tile: TeamAreaTile): string {
    const backgroundColor = tile.y < boardSize.taskArea ? '{blue-bg}' : '{red-bg}';

    if (tile.hasGoal) {
      if (tile.hasCompletedGoal) {
        return `${backgroundColor}{yellow-fg}G{/}`;
      }

      return `${backgroundColor}{white-fg}G{/}`;
    }

    return `${backgroundColor} {/}`;
  }
}
