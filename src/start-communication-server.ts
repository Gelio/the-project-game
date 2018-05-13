import { getMessageValidator } from './common/getMessageValidator';
import { LoggerFactory } from './common/logging/LoggerFactory';

import { CommunicationServer } from './communication-server/CommunicationServer';
import { MessageRouter } from './communication-server/MessageRouter';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./communication-server.config.json');

(async () => {
  const messageRouter = new MessageRouter();

  const loggerFactory = new LoggerFactory();
  const consoleLogger = loggerFactory.createConsoleLogger();

  const messageValidator = await getMessageValidator();

  const communicationServer = new CommunicationServer(
    {
      hostname: config.hostname,
      port: config.port
    },
    messageRouter,
    consoleLogger,
    messageValidator
  );

  communicationServer.init();
})();
