// tslint:disable no-console
import { getMessageValidator } from '../src/common/getMessageValidator';
import { readJSONFile } from '../src/common/readJSONFile';

(async () => {
  if (process.argv.length < 3) {
    console.log('Please provide the file name as an argument');

    return;
  }

  console.log('Compiling schemas...');
  const messageValidator = await getMessageValidator();
  console.log('Schemas compiled');

  console.log('Reading messages...');
  const messagePaths = process.argv.slice(2);
  const messages = await Promise.all(messagePaths.map(readJSONFile));
  console.log('Read messages');

  console.log('Validating messages...');
  messages.forEach((message, index) => {
    const messagePath = messagePaths[index];
    console.log('\nValidating', messagePath);

    const isValid = messageValidator(message);
    console.log('Valid:', isValid);
    if (!isValid) {
      console.error('Errors:', messageValidator.errors);
    }
  });
})();
