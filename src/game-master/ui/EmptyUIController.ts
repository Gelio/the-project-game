import { Service } from '../../interfaces/Service';

import { UIController as IUIController } from './IUIController';

export class EmptyUIController implements Service, IUIController {
  public init() {
    // Left empty intentionally
  }

  public destroy() {
    // Left empty intentionally
  }

  public render() {
    // Left empty intentionally
  }

  public log(lines: string | string[]) {
    // tslint:disable-next-line:no-console
    console.log(lines);
  }

  public updateBoard() {
    // Left empty intentionally
  }

  public updateGameInfo() {
    // Left empty intentionally
  }
}
