import { createBlessedScreen } from './createBlessedScreen';
import { GameMaster } from './game-master/GameMaster';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./game-master.config.json');

const screen = createBlessedScreen();

const gameMaster = new GameMaster(config, screen);
gameMaster.init();
