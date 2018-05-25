import { NPMLoggingLevel } from 'winston';

export interface SharedArguments {
  verbose?: boolean;
  log_level?: NPMLoggingLevel;
}
