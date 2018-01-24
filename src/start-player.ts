import { Player } from './player/Player';
import { registerUncaughtExceptionHandler } from './registerUncaughtExceptionHandler';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./player.config.json');

registerUncaughtExceptionHandler();

const player = new Player(config);
player.init();
