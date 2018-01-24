import { Player } from './player/Player';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./player.config.json');

const player = new Player(config);
player.init();
