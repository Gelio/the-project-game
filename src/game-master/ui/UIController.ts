import * as blessed from 'blessed';

import { Service } from '../../interfaces/Service';

import { config } from '../config';
import { GameMasterOptions } from '../GameMaster';
import { PlayersContainer } from '../PlayersContainer';

import { Board } from '../models/Board';
import { Scoreboard } from '../models/Scoreboard';

import { BoardFormatter } from './BoardFormatter';

import { UIController as IUIController } from './IUIController';

import { LoggerFactory } from '../../common/logging/LoggerFactory';
import { UITransport } from '../../common/logging/UITransport';

export type BoxFactoryFn = (options: blessed.Widgets.BoxOptions) => blessed.Widgets.BoxElement;

export class UIController implements Service, IUIController {
  private readonly screen: blessed.Widgets.Screen;
  private readonly boardFormatter: BoardFormatter;
  private readonly boxFactoryFn: BoxFactoryFn;
  private readonly loggerFactory: LoggerFactory;

  private boardBox: blessed.Widgets.BoxElement;
  private infoBox: blessed.Widgets.BoxElement;
  private logsBox: blessed.Widgets.BoxElement;

  constructor(
    screen: blessed.Widgets.Screen,
    boxFactoryFn: BoxFactoryFn,
    loggerFactory: LoggerFactory
  ) {
    this.screen = screen;
    this.boardFormatter = new BoardFormatter();
    this.boxFactoryFn = boxFactoryFn;
    this.loggerFactory = loggerFactory;

    this.log = this.log.bind(this);
  }

  public init() {
    this.boardBox = this.boxFactoryFn({
      width: '50%',
      height: '100%',
      border: {
        type: 'line'
      },
      tags: true
    });
    this.boardBox.setContent(`${config.uiLabelStyle}Board{/}`);

    this.infoBox = this.boxFactoryFn({
      left: '50%',
      width: '50%',
      height: '30%',
      border: {
        type: 'line'
      },
      tags: true
    });
    this.infoBox.setContent(`${config.uiLabelStyle}Info{/}`);

    this.logsBox = this.boxFactoryFn({
      left: '50%',
      top: '30%',
      width: '50%',
      height: '70%',
      border: {
        type: 'line'
      },
      tags: true,
      scrollable: true
    });
    this.logsBox.setContent(`${config.uiLabelStyle}Logs{/}`);

    this.screen.append(this.boardBox);
    this.screen.append(this.infoBox);
    this.screen.append(this.logsBox);
    this.render();
  }

  public destroy() {
    this.screen.destroy();
  }

  public render() {
    this.screen.render();
  }

  public updateBoard(board: Board) {
    this.boardBox.setContent(`${config.uiLabelStyle}Board{/}`);
    const tiles = board.tiles;

    for (let y = 0; y < tiles[0].length; y++) {
      const line = tiles.map(tilesRow => this.boardFormatter.displayTile(board.size, tilesRow[y]));
      this.boardBox.pushLine(line.join(''));
    }

    this.render();
  }

  public updateGameInfo(
    currentRound: number,
    gameMasterOptions: GameMasterOptions,
    board: Board,
    scoreboard: Scoreboard,
    playersContainer: PlayersContainer
  ) {
    this.infoBox.setContent(`${config.uiLabelStyle}Info{/}`);

    this.infoBox.pushLine(`Round: ${currentRound} / ${gameMasterOptions.gamesLimit}`);
    this.infoBox.pushLine(
      `{blue-fg}Blue{/} team score: ${scoreboard.team1Score} / ${scoreboard.scoreLimit}`
    );
    this.infoBox.pushLine(
      `{red-fg}Red{/} team score: ${scoreboard.team2Score} / ${scoreboard.scoreLimit}`
    );

    const blueTeamPlayers = playersContainer.getPlayersFromTeam(1).length;
    const blueTeamCapacity = gameMasterOptions.teamSizes[1];
    this.infoBox.pushLine('');
    this.infoBox.pushLine(
      `{blue-fg}Blue{/} team players: ${blueTeamPlayers} / ${blueTeamCapacity}`
    );
    const redTeamPlayers = playersContainer.getPlayersFromTeam(2).length;
    const redTeamCapacity = gameMasterOptions.teamSizes[2];
    this.infoBox.pushLine(`{red-fg}Red{/} team players: ${redTeamPlayers} / ${redTeamCapacity}`);

    this.infoBox.pushLine('');
    const pickedUpPiecesCount = board.pieces.filter(piece => piece.isPickedUp).length;
    const shamCount = board.pieces.filter(piece => piece.isSham).length;
    this.infoBox.pushLine(
      `Pieces: ${board.pieces.length} (${pickedUpPiecesCount} picked up, ${shamCount} shams)`
    );

    this.render();
  }

  public createLogger() {
    const uiTransport = new UITransport(this.log);

    return this.loggerFactory.createLogger([uiTransport]);
  }

  private log(message: string) {
    this.logsBox.pushLine(message);
    this.logsBox.setScrollPerc(100);
    this.render();
  }
}
