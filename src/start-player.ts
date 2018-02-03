import { LoggerFactory } from './common/logging/LoggerFactory';

import { createBlessedScreen } from './createBlessedScreen';

import { Player } from './player/Player';
import { UIController } from './player/ui/UIController';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./player.config.json');

const screen = createBlessedScreen();
const uiController = new UIController(screen);
const loggerFactory = new LoggerFactory();

const player = new Player(config, uiController, loggerFactory);
player.init();
