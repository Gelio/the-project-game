import { LoggerFactory } from './common/logging/LoggerFactory';

import { createBlessedScreen } from './createBlessedScreen';

import { GameMaster } from './game-master/GameMaster';
import { UIController } from './game-master/ui/UIController';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./game-master.config.json');

const screen = createBlessedScreen();
const uiController = new UIController(screen);

const loggerFactory = new LoggerFactory();
loggerFactory.logLevel = 'verbose';

const gameMaster = new GameMaster(config, uiController, loggerFactory);
gameMaster.init();
