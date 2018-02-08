import * as blessed from 'blessed';

import { Service } from '../../interfaces/Service';
import { config } from '../config';

export class UIController implements Service {
  private readonly screen: blessed.Widgets.Screen;

  private boardBox: blessed.Widgets.BoxElement;
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
    this.boardBox.setContent(`${config.uiLabelStyle}Board{/}`);

    this.logsBox = blessed.box({
      width: '50%',
      height: '100%',
      left: '50%',
      border: {
        type: 'line'
      },
      tags: true,
      scrollable: true
    });
    this.logsBox.setContent(`${config.uiLabelStyle}Logs{/}`);

    this.screen.append(this.boardBox);
    this.screen.append(this.logsBox);
  }

  public destroy() {
    this.screen.destroy();
  }

  public log(lines: string | string[]) {
    this.logsBox.pushLine(lines);
    this.logsBox.setScrollPerc(100);
    this.render();
  }

  public render() {
    this.screen.render();
  }
}