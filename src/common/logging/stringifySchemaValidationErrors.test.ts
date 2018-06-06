import { ErrorObject } from 'ajv';

import { stringifySchemaValidationErrors } from './stringifySchemaValidationErrors';

describe('stringifySchemaValidationErrors', () => {
  it('should match snapshot', () => {
    const errors: ErrorObject[] = <any>[
      {
        keyword: 'foo',
        dataPath: 'bar',
        message: 'test'
      },
      {
        keyword: 'foo1',
        dataPath: 'bar2',
        message: 'test'
      }
    ];

    const result = stringifySchemaValidationErrors(errors);

    expect(result).toMatchSnapshot();
  });

  it('should not errors with const keyword and .type dataPath', () => {
    const errors: ErrorObject[] = <any>[
      {
        keyword: 'const',
        dataPath: '.type',
        message: 'test'
      },
      {
        keyword: 'foo1',
        dataPath: 'bar2',
        message: 'test'
      }
    ];

    const result = stringifySchemaValidationErrors(errors);

    expect(result.includes('const')).toBe(false);
  });
});
