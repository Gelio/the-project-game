import { createBlessedScreen } from './createBlessedScreen';
import { Player } from './player/Player';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./player.config.json');

const screen = createBlessedScreen();

const player = new Player(config, screen);
player.init();
