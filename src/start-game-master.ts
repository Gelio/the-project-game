import { GameMaster } from './game-master/GameMaster';
import { registerUncaughtExceptionHandler } from './registerUncaughtExceptionHandler';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./game-master.config.json');

registerUncaughtExceptionHandler();

const gameMaster = new GameMaster(config);
gameMaster.init();
