import { ArgumentParser } from 'argparse';
import * as blessed from 'blessed';
import { Socket } from 'net';

import { GameLogsCsvWriter } from './common/logging/GameLogsCsvWriter';
import { LoggerFactory } from './common/logging/LoggerFactory';

import { Communicator } from './common/Communicator';

import { createBlessedScreen } from './createBlessedScreen';

import { connectToServer } from './game-master/connectToServerFn';
import { GameMaster } from './game-master/GameMaster';
import { EmptyUIController } from './game-master/ui/EmptyUIController';
import { UIController as IUIController } from './game-master/ui/IUIController';
import { UIController } from './game-master/ui/UIController';

import { GMArguments } from './interfaces/arguments/GMArguments';

import { addSharedArguments } from './arguments/addSharedArguments';
import { getLogLevel } from './arguments/getLogLevel';

import { validateGameMasterConfig } from './game-master/validation/validateGameMasterConfig';

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

  const logger = loggerFactory.createConsoleLogger();
  try {
    await validateGameMasterConfig(config);
  } catch (error) {
    logger.error('Game Master configuration error');
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error(JSON.stringify(error, null, 2));
    }

    return;
  }

  let gmSocket: Socket;

  try {
    const socket = await connectToServer(config.serverHostname, config.serverPort);

    gmSocket = socket;

    logger.verbose('Connected to the server');
  } catch (error) {
    logger.error(
      `Failed to establish connection to the server ${config.serverHostname}:${config.serverPort}`
    );

    logger.verbose(error.message);

    return;
  }

  let uiController: IUIController;
  if (parsedArguments.no_ui) {
    uiController = new EmptyUIController(loggerFactory);
  } else {
    const screen = createBlessedScreen();
    uiController = new UIController(screen, blessed.box, loggerFactory);
  }

  const communicator = new Communicator(gmSocket, uiController.createLogger());
  communicator.bindListeners();

  const gameLogsCsvWriter = new GameLogsCsvWriter(config.gameName, config.logsDirectory);
  const gameMaster = new GameMaster(config, uiController, gameLogsCsvWriter, communicator);
  gameMaster.init();
})();
