import { ArgumentParser } from 'argparse';
import { addSharedArguments } from './addSharedArguments';

describe('addSharedArguments', () => {
  let parser: ArgumentParser;

  beforeEach(() => {
    parser = <any>{
      addArgument: jest.fn()
    };
  });

  it('should match snapshot', () => {
    addSharedArguments(parser);

    expect((<jest.Mock>parser.addArgument).mock.calls).toMatchSnapshot();
  });
});
