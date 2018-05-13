import * as ajv from 'ajv';

import { Message } from '../interfaces/Message';

export interface SimpleMessageValidator {
  (message: Message<any>): boolean | PromiseLike<any>;

  errors?: ajv.ErrorObject[] | null;
}
