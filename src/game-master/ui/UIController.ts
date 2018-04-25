import * as blessed from 'blessed';

import { Service } from '../../interfaces/Service';
import { config } from '../config';
import { Board } from '../models/Board';
import { BoardFormatter } from './BoardFormatter';

export class UIController implements Service {
  private readonly screen: blessed.Widgets.Screen;
  private readonly boardFormatter: BoardFormatter;

  private boardBox: blessed.Widgets.BoxElement;
  private infoBox: blessed.Widgets.BoxElement;
  private logsBox: blessed.Widgets.BoxElement;

  constructor(screen: blessed.Widgets.Screen) {
    this.screen = screen;
    this.boardFormatter = new BoardFormatter();
  }

  public init() {
    this.boardBox = blessed.box({
      width: '50%',
      height: '100%',
      border: {
        type: 'line'
      },
      tags: true
    });
    this.boardBox.setContent(`${config.uiLabelStyle}Board{/}`);

    this.infoBox = blessed.box({
      left: '50%',
      width: '50%',
      height: '30%',
      border: {
        type: 'line'
      },
      tags: true
    });
    this.infoBox.setContent(`${config.uiLabelStyle}Info{/}`);

    this.logsBox = blessed.box({
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

  public log(lines: string | string[]) {
    this.logsBox.pushLine(lines);
    this.logsBox.setScrollPerc(100);
    this.render();
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
}
