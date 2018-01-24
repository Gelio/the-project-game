import { CommunicationServer } from './communication-server/CommunicationServer';
import { MessageRouter } from './communication-server/MessageRouter';
import { registerUncaughtExceptionHandler } from './registerUncaughtExceptionHandler';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./communication-server.config.json');

registerUncaughtExceptionHandler();

const messageRouter = new MessageRouter();
const communicationServer = new CommunicationServer(
  {
    hostname: config.hostname,
    port: config.port
  },
  messageRouter
);

communicationServer.init();
