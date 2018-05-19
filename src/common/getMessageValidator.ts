import * as ajv from 'ajv';
import * as glob from 'glob';

import { config } from '../config';
import { readJSONFile } from './readJSONFile';

export async function getMessageValidator(): Promise<ajv.ValidateFunction> {
  const schemasPromise = readGlobbedJSONFiles(config.schemasGlob);
  const schemaDefinitionsPromise = readGlobbedJSONFiles(config.commonSchemaDefinitionsGlob);

  const [schemas, schemaDefinitions] = await Promise.all([
    schemasPromise,
    schemaDefinitionsPromise
  ]);

  const finalSchema = {
    type: 'object',
    oneOf: schemas
  };

  const ajvInstance = new ajv();
  ajvInstance.addSchema(schemaDefinitions);

  return ajvInstance.compile(finalSchema);
}

function globPromise(pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, (error, matches) => {
      if (error) {
        reject(error);
      } else {
        resolve(matches);
      }
    });
  });
}

async function readGlobbedJSONFiles(pattern: string): Promise<object[]> {
  // Oh Haskell monad syntax, where are you (╯°□°）╯︵ ┻━┻
  // globPromise pattern >>= fmap readJSONFile

  return globPromise(pattern).then(files =>
    // NOTE: `undefined` has to be used when calling `readJSONFile` in order for dependency
    // injection to work
    Promise.all(files.map(filePath => readJSONFile(filePath, undefined)))
  );
}
