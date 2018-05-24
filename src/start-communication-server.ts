import * as ajv from 'ajv';
import { ArgumentParser } from 'argparse';

import { LoggerFactory } from './common/logging/LoggerFactory';
import { getMessageValidator } from './common/validation/getMessageValidator';
import { validateJSON } from './common/validation/validateJSON';

import { CommunicationServer } from './communication-server/CommunicationServer';
import { MessageRouter } from './communication-server/MessageRouter';

import { CSArguments } from './interfaces/arguments/CSArguments';

import { addSharedArguments } from './arguments/addSharedArguments';
import { getLogLevel } from './arguments/getLogLevel';

// tslint:disable no-require-imports no-var-requires
const config = require('./communication-server.config.json');
const csConfigSchema = require('../schemas/configs/communication-server-config.json');
// tslint:enable no-require-imports no-var-requires

function parseCSArguments(): CSArguments {
  const parser = new ArgumentParser({
    description: 'Communication server',
    addHelp: true
  });

  addSharedArguments(parser);

  return parser.parseArgs();
}

(async () => {
  const messageRouter = new MessageRouter();
  const parsedArguments = parseCSArguments();

  const loggerFactory = new LoggerFactory();
  loggerFactory.logLevel = getLogLevel(parsedArguments);

  const consoleLogger = loggerFactory.createConsoleLogger();

  try {
    await validateJSON(csConfigSchema, config);
  } catch (error) {
    consoleLogger.error('Communication Server config is invalid');
    if (error instanceof Error) {
      consoleLogger.error(error.message);
    } else {
      consoleLogger.error(JSON.stringify(error, null, 2));
    }

    return;
  }

  let messageValidator: ajv.ValidateFunction;
  try {
    messageValidator = await getMessageValidator();
  } catch (error) {
    consoleLogger.error('Schema compilation failed');
    consoleLogger.error(JSON.stringify(error));

    return;
  }

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
