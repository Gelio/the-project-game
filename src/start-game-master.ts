import { ArgumentParser } from 'argparse';
import * as blessed from 'blessed';

import { LoggerFactory } from './common/logging/LoggerFactory';

import { createBlessedScreen } from './createBlessedScreen';

import { GameMaster } from './game-master/GameMaster';
import { EmptyUIController } from './game-master/ui/EmptyUIController';
import { UIController as IUIController } from './game-master/ui/IUIController';
import { UIController } from './game-master/ui/UIController';

import { GMArguments } from './interfaces/arguments/GMArguments';

import { addSharedArguments } from './arguments/addSharedArguments';
import { getLogLevel } from './arguments/getLogLevel';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./game-master.config.json');

function parseGMArguments(): GMArguments {
  const parser = new ArgumentParser({
    description: 'Communication server',
    addHelp: true
  });

  addSharedArguments(parser);
  parser.addArgument(['--no-ui'], { nargs: 0 });

  return parser.parseArgs();
}

const parsedArguments = parseGMArguments();

let uiController: IUIController;
if (parsedArguments.no_ui) {
  uiController = new EmptyUIController();
} else {
  const screen = createBlessedScreen();
  uiController = new UIController(screen, blessed.box);
}

const loggerFactory = new LoggerFactory();
loggerFactory.logLevel = getLogLevel(parsedArguments);

const gameMaster = new GameMaster(config, uiController, loggerFactory);
gameMaster.init();
