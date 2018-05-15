import { readFile } from 'fs';

export function readJSONFile(filePath: string): Promise<object> {
  return new Promise((resolve, reject) => {
    readFile(filePath, { encoding: 'utf8' }, (readError, data) => {
      if (readError) {
        reject(readError);

        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}
