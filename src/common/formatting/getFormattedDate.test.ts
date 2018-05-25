import { getFormattedDate } from './getFormattedDate';

describe('getFormattedDate', () => {
  it('should match snapshot', () => {
    const date = new Date(2018, 4, 25, 15, 11, 50);

    const formattedDate = getFormattedDate(date);

    expect(formattedDate).toMatchSnapshot();
  });
});
