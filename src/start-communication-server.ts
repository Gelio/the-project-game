import { LoggerFactory } from './common/logging/LoggerFactory';
import { CommunicationServer } from './communication-server/CommunicationServer';
import { MessageRouter } from './communication-server/MessageRouter';

// tslint:disable-next-line:no-require-imports no-var-requires
const config = require('./communication-server.config.json');

const messageRouter = new MessageRouter();

const loggerFactory = new LoggerFactory();
const consoleLogger = loggerFactory.createConsoleLogger();

const communicationServer = new CommunicationServer(
  {
    hostname: config.hostname,
    port: config.port
  },
  messageRouter,
  consoleLogger
);

communicationServer.init();
