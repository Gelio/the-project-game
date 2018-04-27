import * as blessed from 'blessed';

import { UIController } from './UIController';

import { Board } from '../models/Board';
import { GameMasterOptions } from '../GameMaster';
import { Scoreboard } from '../models/Scoreboard';
import { PlayersContainer } from '../PlayersContainer';
import { Player } from '../Player';
import { Piece } from '../models/Piece';

describe('[GM] UIController', () => {
  let boxes: blessed.Widgets.BoxElement[];
  let screen: blessed.Widgets.Screen;
  let uiController: UIController;

  function createMockScreen(): blessed.Widgets.Screen {
    return <any>{
      render: jest.fn(),
      append: jest.fn(box => boxes.push(box)),
      destroy: jest.fn()
    };
  }

  function createMockBox(): blessed.Widgets.BoxElement {
    let content = '';

    return <any>{
      setContent: jest.fn(val => (content = val)),
      getContent: jest.fn(() => content),
      pushLine: jest.fn(line => (content += `\n${line}`)),
      setScrollPerc: jest.fn()
    };
  }

  function findBox(name: string): blessed.Widgets.BoxElement {
    return <blessed.Widgets.BoxElement>boxes.find(box => box.getContent().includes(name));
  }

  beforeEach(() => {
    boxes = [];
    screen = createMockScreen();
    uiController = new UIController(screen, createMockBox);
  });

  describe('init', () => {
    it('should create and append three boxes', () => {
      uiController.init();

      expect(screen.append).toHaveBeenCalledTimes(3);
    });

    it('should render the screen', () => {
      uiController.init();

      expect(screen.render).toHaveBeenCalled();
    });

    it('should append the logs box', () => {
      uiController.init();

      const logsBox = findBox('Logs');

      expect(logsBox).toBeDefined();
    });

    it('should append the board box', () => {
      uiController.init();

      const boardBox = findBox('Board');

      expect(boardBox).toBeDefined();
    });

    it('should append the info box', () => {
      uiController.init();

      const infoBox = findBox('Info');

      expect(infoBox).toBeDefined();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      uiController.init();
    });

    it('should destroy the screen', () => {
      uiController.destroy();

      expect(screen.destroy).toHaveBeenCalled();
    });
  });

  describe('render', () => {
    beforeEach(() => {
      uiController.init();
    });

    it('should render the screen', () => {
      uiController.render();

      expect(screen.render).toHaveBeenCalled();
    });
  });

  describe('log', () => {
    beforeEach(() => {
      uiController.init();
    });

    it('should push and scroll in the logs box', () => {
      const logsBox = findBox('Logs');
      spyOn(logsBox, 'pushLine');
      spyOn(logsBox, 'setScrollPerc');

      uiController.log('test');

      expect(logsBox.pushLine).toHaveBeenCalledWith('test');
      expect(logsBox.setScrollPerc).toHaveBeenCalledWith(100);
    });
  });

  describe('updateBoard', () => {
    let board: Board;

    beforeEach(() => {
      board = new Board(
        {
          goalArea: 2,
          taskArea: 3,
          x: 5
        },
        /**
         * NOTE: for snapshot tests to work the board needs to have team areas covered in goals
         * to prevent random goal generation.
         */
        10
      );

      uiController.init();
    });

    it('should update the board box', () => {
      uiController.updateBoard(board);

      const boardBox = findBox('Board');

      expect(boardBox.getContent()).toMatchSnapshot();
    });

    it('should render the screen', () => {
      uiController.updateBoard(board);

      expect(screen.render).toHaveBeenCalled();
    });
  });

  describe('updateGameInfo', () => {
    let currentRound: number;
    let board: Board;
    let gameMasterOptions: GameMasterOptions;
    let scoreboard: Scoreboard;
    let playersContainer: PlayersContainer;
    let infoBox: blessed.Widgets.BoxElement;

    beforeEach(() => {
      currentRound = 1;

      board = new Board(
        {
          goalArea: 2,
          taskArea: 3,
          x: 5
        },
        5
      );

      gameMasterOptions = <any>{
        gamesLimit: 5,
        teamSizes: {
          1: 2,
          2: 3
        }
      };

      scoreboard = new Scoreboard(board.pointsLimit);

      playersContainer = new PlayersContainer();

      uiController.init();
      infoBox = findBox('Info');
    });

    function runUpdateGameInfo() {
      uiController.updateGameInfo(
        currentRound,
        gameMasterOptions,
        board,
        scoreboard,
        playersContainer
      );
    }

    it('should call render on the screen', () => {
      runUpdateGameInfo();

      expect(screen.render).toHaveBeenCalled();
    });

    it('should match snapshot by default', () => {
      runUpdateGameInfo();

      expect(infoBox.getContent()).toMatchSnapshot();
    });

    it('should match snapshot for the next round', () => {
      currentRound = 2;
      runUpdateGameInfo();

      expect(infoBox.getContent()).toMatchSnapshot();
    });

    it('should match snapshot when scores have changed', () => {
      scoreboard.team1Score = 2;
      scoreboard.team2Score = 5;
      runUpdateGameInfo();

      expect(infoBox.getContent()).toMatchSnapshot();
    });

    it('should match snapshot after players joined', () => {
      const player1 = new Player();
      player1.teamId = 1;

      const player2 = new Player();
      player2.teamId = 2;

      playersContainer.addPlayer(player1);
      playersContainer.addPlayer(player2);

      runUpdateGameInfo();

      expect(infoBox.getContent()).toMatchSnapshot();
    });

    it('should match snapshot after a piece is added', () => {
      const piece = new Piece();
      piece.isPickedUp = true;
      piece.isSham = false;

      runUpdateGameInfo();

      expect(infoBox.getContent()).toMatchSnapshot();
    });
  });
});
