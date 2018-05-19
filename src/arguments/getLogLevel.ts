import { SharedArguments } from '../interfaces/arguments/SharedArguments';

export function getLogLevel(sharedArguments: SharedArguments) {
  if (sharedArguments.verbose) {
    return 'verbose';
  }

  return sharedArguments.log_level || 'info';
}
