import { BoardFormatter } from './BoardFormatter';

import { BoardSize } from '../../interfaces/BoardSize';
import { Player } from '../Player';
import { NeutralAreaTile } from '../models/tiles/NeutralAreaTile';
import { Piece } from '../models/Piece';
import { TeamAreaTile } from '../models/tiles/TeamAreaTile';

describe('[GM] BoardFormatter', () => {
  let boardFormatter: BoardFormatter;
  let boardSize: BoardSize;

  beforeEach(() => {
    boardFormatter = new BoardFormatter();

    boardSize = {
      x: 10,
      goalArea: 10,
      taskArea: 20
    };
  });

  describe('displayTile', () => {
    describe('with player', () => {
      it('should match snapshot for player from team 1', () => {
        const player = new Player();
        player.teamId = 1;

        const tile = new NeutralAreaTile(0, 0);
        tile.player = player;

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toMatchSnapshot();
      });

      it('should match snapshot for player from team 2', () => {
        const player = new Player();
        player.teamId = 2;

        const tile = new NeutralAreaTile(0, 0);
        tile.player = player;

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toMatchSnapshot();
      });

      it('should return different values for players from different teams', () => {
        const player = new Player();
        player.teamId = 1;

        const tile = new NeutralAreaTile(0, 0);
        tile.player = player;

        const resultTeam1 = boardFormatter.displayTile(boardSize, tile);

        player.teamId = 2;
        const resultTeam2 = boardFormatter.displayTile(boardSize, tile);

        expect(resultTeam1).not.toBe(resultTeam2);
      });
    });

    describe('with piece', () => {
      it('should match snapshot for sham', () => {
        const piece = new Piece();
        piece.isSham = true;

        const tile = new NeutralAreaTile(0, 0);
        tile.piece = piece;

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toMatchSnapshot();
      });

      it('should match snapshot for valid pieces', () => {
        const piece = new Piece();
        piece.isSham = false;

        const tile = new NeutralAreaTile(0, 0);
        tile.piece = piece;

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toMatchSnapshot();
      });

      it('should return different values whether piece is a sham or not', () => {
        const piece = new Piece();
        piece.isSham = true;

        const tile = new NeutralAreaTile(0, 0);
        tile.piece = piece;

        const resultSham = boardFormatter.displayTile(boardSize, tile);

        piece.isSham = false;
        const resultValid = boardFormatter.displayTile(boardSize, tile);

        expect(resultSham).not.toBe(resultValid);
      });
    });

    describe('for team area tile', () => {
      it('should match snapshot for the first team', () => {
        const tile = new TeamAreaTile(0, 0);

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toMatchSnapshot();
      });

      it('should match snapshot for the second team', () => {
        const tile = new TeamAreaTile(0, boardSize.goalArea + boardSize.taskArea);

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toMatchSnapshot();
      });

      it('should match snapshot when the tile has an uncompleted goal', () => {
        const tile = new TeamAreaTile(0, 0);
        tile.hasGoal = true;
        tile.hasCompletedGoal = false;

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toMatchSnapshot();
      });

      it('should match snapshot when the tile has a completed goal', () => {
        const tile = new TeamAreaTile(0, 0);
        tile.hasGoal = true;
        tile.hasCompletedGoal = true;

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toMatchSnapshot();
      });

      it('should return different values for different team areas', () => {
        const team1Tile = new TeamAreaTile(0, 0);
        const team2Tile = new TeamAreaTile(0, boardSize.goalArea + boardSize.taskArea);

        const resultTeam1 = boardFormatter.displayTile(boardSize, team1Tile);
        const resultTeam2 = boardFormatter.displayTile(boardSize, team2Tile);

        expect(resultTeam1).not.toBe(resultTeam2);
      });
    });

    describe('for neutral area tile', () => {
      it('should return a space', () => {
        const tile = new NeutralAreaTile(0, 0);

        const result = boardFormatter.displayTile(boardSize, tile);

        expect(result).toBe(' ');
      });
    });

    it('should throw an error when given an unknown tile', () => {
      expect(() => boardFormatter.displayTile(boardSize, <any>{})).toThrow();
    });
  });
});
