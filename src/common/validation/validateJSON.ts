import { getAjvWithCommonSchemas } from './getAjvWithCommonSchemas';

/**
 * This method should be used only when validating a single file once (for instance
 * validating the configuration at the start of some component).
 *
 * If repeated validation should be performed, use `getMessageValidator` or write a custom function.
 *
 * @param schema Parsed JSON schema
 * @param data Object to be validated
 */
export async function validateJSON(schema: object, data: object) {
  const ajvInstance = await getAjvWithCommonSchemas();

  if (!ajvInstance.validate(schema, data)) {
    throw ajvInstance.errors;
  }
}
