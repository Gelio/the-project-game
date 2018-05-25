import { ArgumentParser } from 'argparse';

export function addSharedArguments(parser: ArgumentParser) {
  parser.addArgument(['-v', '--verbose'], { nargs: 0 });
  parser.addArgument(['--log-level'], {
    choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
  });
}
