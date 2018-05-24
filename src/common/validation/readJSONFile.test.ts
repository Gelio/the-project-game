import { readJSONFile } from './readJSONFile';

describe('readJSONFile', () => {
  it('should reject with an error when reading the file fails', () => {
    function readFile(_path: string, _options: any, callback: Function) {
      callback(new Error('test'));
    }

    expect(readJSONFile('path', readFile)).rejects.toMatchSnapshot();
  });

  it('should reject with an error when parsing the file fails', () => {
    function readFile(_path: string, _options: any, callback: Function) {
      callback(null, 'not valid JSON');
    }

    expect(readJSONFile('path', readFile)).rejects.toMatchSnapshot();
  });

  it('should resolve with the parsed object', () => {
    const obj = {
      test: 'foo'
    };

    function readFile(_path: string, _options: any, callback: Function) {
      callback(null, JSON.stringify(obj));
    }

    expect(readJSONFile('path', readFile)).resolves.toEqual(obj);
  });

  it('should read the file from the specified path', () => {
    const readFile = jest.fn();
    const filePath = 'foo';

    readJSONFile(filePath, readFile);

    expect(readFile.mock.calls[0][0]).toBe(filePath);
  });
});
