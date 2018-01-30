import * as blessed from 'blessed';

import { Service } from '../../interfaces/Service';
import { GameMasterState } from '../GameMasterState';

export class UIController implements Service {
  private readonly screen: blessed.Widgets.Screen;
  private gameMasterState: GameMasterState;

  private boardBox: blessed.Widgets.BoxElement;
  private infoBox: blessed.Widgets.BoxElement;
  private logsBox: blessed.Widgets.BoxElement;

  constructor(screen: blessed.Widgets.Screen) {
    this.screen = screen;
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
    this.boardBox.setContent('{red-fg}{bold}Board{/}');

    this.infoBox = blessed.box({
      left: '50%',
      width: '50%',
      height: '30%',
      border: {
        type: 'line'
      },
      tags: true
    });
    this.infoBox.setContent('{red-fg}{bold}Info{/}');

    this.logsBox = blessed.box({
      left: '50%',
      top: '30%',
      width: '50%',
      height: '70%',
      border: {
        type: 'line'
      },
      tags: true
    });
    this.logsBox.setContent('{red-fg}{bold}Logs{/}');

    this.screen.append(this.boardBox);
    this.screen.append(this.infoBox);
    this.screen.append(this.logsBox);
    this.render();
  }

  public destroy() {
    this.screen.destroy();
  }

  public updateGameMasterState(state: GameMasterState) {
    this.gameMasterState = state;
  }

  public render() {
    this.screen.render();
  }

  public log(lines: string | string[]) {
    this.logsBox.pushLine(lines);
    this.render();
  }
}
