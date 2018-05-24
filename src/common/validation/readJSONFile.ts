import { readFile as fsReadFile } from 'fs';

type ReadFileFn = (
  path: string,
  options: { encoding: string; flag?: string } | string,
  callback: (err: NodeJS.ErrnoException, data: string) => void
) => void;

export function readJSONFile(filePath: string, readFile: ReadFileFn = fsReadFile): Promise<object> {
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
