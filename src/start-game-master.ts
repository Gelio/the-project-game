import { ArgumentParser } from 'argparse';
import * as blessed from 'blessed';

import { GameLogsCsvWriter } from './common/logging/GameLogsCsvWriter';
import { LoggerFactory } from './common/logging/LoggerFactory';

import { createBlessedScreen } from './createBlessedScreen';

import { GameMaster } from './game-master/GameMaster';
import { EmptyUIController } from './game-master/ui/EmptyUIController';
import { UIController as IUIController } from './game-master/ui/IUIController';
import { UIController } from './game-master/ui/UIController';

import { GMArguments } from './interfaces/arguments/GMArguments';

import { addSharedArguments } from './arguments/addSharedArguments';
import { getLogLevel } from './arguments/getLogLevel';
<<<<<<< HEAD
<<<<<<< HEAD
import { validateGameMasterConfig } from './game-master/validation/validateGameMasterConfig';
=======
import { CsvWriter } from './common/logging/CsvWriter';
>>>>>>> [GM] remove CsvLogFactory
=======
>>>>>>> [GM] check if config exists

// tslint:disable-next-line no-require-imports no-var-requires
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

(async () => {
  const parsedArguments = parseGMArguments();

  const loggerFactory = new LoggerFactory();
  loggerFactory.logLevel = getLogLevel(parsedArguments);

  try {
    await validateGameMasterConfig(config);
  } catch (error) {
    const logger = loggerFactory.createConsoleLogger();

    logger.error('Game Master configuration error');
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error(JSON.stringify(error, null, 2));
    }

    return;
  }

<<<<<<< HEAD
  let uiController: IUIController;
  if (parsedArguments.no_ui) {
    uiController = new EmptyUIController(loggerFactory);
  } else {
    const screen = createBlessedScreen();
    uiController = new UIController(screen, blessed.box, loggerFactory);
  }

  const csvWriter = new CsvWriter(config.gameName);

<<<<<<< HEAD
  const gameMaster = new GameMaster(config, uiController, csvWriter);
  gameMaster.init();
})();
=======
let csvWriter;
=======
let gameLogsCsvWriter;
>>>>>>> [GM] check if config exists

let gameName;

if (config) {
  gameName = config.gameName;
} else {
  gameName = 'Invalid GM config';
}

gameLogsCsvWriter = new GameLogsCsvWriter(gameName);

const gameMaster = new GameMaster(config, uiController, gameLogsCsvWriter);
gameMaster.init();
>>>>>>> [GM] remove CsvLogFactory
