import * as ajv from 'ajv';

export function stringifySchemaValidationErrors(errors: ajv.ErrorObject[]): string {
  const filteredErrors = errors.filter(
    error => error.keyword !== 'const' || error.dataPath !== '.type'
  );

  return JSON.stringify(filteredErrors, null, 2);
}
