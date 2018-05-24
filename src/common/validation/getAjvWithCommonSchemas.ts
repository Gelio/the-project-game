import * as ajv from 'ajv';

import { config } from '../../config';
import { readGlobbedJSONFiles } from './readGlobbedJSONFiles';

export async function getAjvWithCommonSchemas(): Promise<ajv.Ajv> {
  const schemaDefinitions = await readGlobbedJSONFiles(config.commonSchemaDefinitionsGlob);

  const ajvInstance = new ajv();
  ajvInstance.addSchema(schemaDefinitions);

  return ajvInstance;
}
