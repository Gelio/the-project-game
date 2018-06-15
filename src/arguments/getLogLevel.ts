import { NPMLoggingLevel } from 'winston';

import { SharedArguments } from '../interfaces/arguments/SharedArguments';

export function getLogLevel(sharedArguments: SharedArguments): NPMLoggingLevel {
  if (sharedArguments.verbose) {
    return 'verbose';
  }

  return sharedArguments.log_level || 'info';
}
