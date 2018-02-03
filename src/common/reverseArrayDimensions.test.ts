import { reverseArrayDimensions } from './reverseArrayDimensions';

describe('reverseArrayDimensions', () => {
  it('should reverse dimensions of a regular 2-dimensional array', () => {
    const source = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

    const result = reverseArrayDimensions(source);

    const expectedResult = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];

    expect(result).toEqual(expectedResult);
  });

  it('should return empty array when source array is empty', () => {
    const source: number[][] = [];

    const result = reverseArrayDimensions(source);

    const expectedResult: number[][] = [];

    expect(result).toEqual(expectedResult);
  });
});
