import * as glob from 'glob';

import { readJSONFile } from './readJSONFile';

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

export async function readGlobbedJSONFiles(pattern: string): Promise<object[]> {
  // Oh Haskell monad syntax, where are you (╯°□°）╯︵ ┻━┻
  // globPromise pattern >>= fmap readJSONFile
  return globPromise(pattern).then(files =>
    Promise.all(files.map(fileName => readJSONFile(fileName, undefined)))
  );
}
