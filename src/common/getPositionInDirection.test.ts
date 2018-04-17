import { getPositionInDirection } from './getPositionInDirection';
import { Point } from './Point';

import { Direction } from '../interfaces/Direction';

describe('getPositionInDirection', () => {
  let entryPoint: Point;
  beforeAll(() => {
    entryPoint = new Point(5, 5);
  });

  it('should return point to the left from previous', () => {
    const result = getPositionInDirection(entryPoint, Direction.Left);
    expect(result.x).toBe(4);
    expect(result.y).toBe(5);
  });

  it('should return point to the right from previous', () => {
    const result = getPositionInDirection(entryPoint, Direction.Right);
    expect(result.x).toBe(6);
    expect(result.y).toBe(5);
  });

  it('should return point above previous', () => {
    const result = getPositionInDirection(entryPoint, Direction.Up);
    expect(result.x).toBe(5);
    expect(result.y).toBe(4);
  });

  it('should return point under previous', () => {
    const result = getPositionInDirection(entryPoint, Direction.Down);
    expect(result.x).toBe(5);
    expect(result.y).toBe(6);
  });

  it('should throw error when direction is invalid', () => {
    expect(() => {
      getPositionInDirection(entryPoint, <any>'test');
    }).toThrow();
  });
});
