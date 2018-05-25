import { ValidateFunction } from 'ajv';

import { readGlobbedJSONFiles } from './readGlobbedJSONFiles';

import { config } from '../../config';
import { getAjvWithCommonSchemas } from './getAjvWithCommonSchemas';

export async function getMessageValidator(): Promise<ValidateFunction> {
  const schemasPromise = readGlobbedJSONFiles(config.schemasGlob);
  const ajvInstancePromise = getAjvWithCommonSchemas();

  const [schemas, ajvInstance] = await Promise.all([schemasPromise, ajvInstancePromise]);

  const finalSchema = {
    type: 'object',
    oneOf: schemas
  };

  return ajvInstance.compile(finalSchema);
}
