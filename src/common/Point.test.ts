import { Point } from './Point';

describe('Point', () => {
  it('should instantiate correctly', () => {
    expect(new Point(1, 2)).toBeDefined();
  });

  it('should have x and y as defined in the constructor', () => {
    const point = new Point(1, 2);

    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
  });

  describe('clone', () => {
    it('should return a new point', () => {
      const original = new Point(1, 2);
      const cloned = original.clone();

      expect(cloned).not.toBe(original);
    });

    it('should return a point with the same coordinates', () => {
      const original = new Point(1, 2);
      const cloned = original.clone();

      expect(cloned.x).toBe(original.x);
      expect(cloned.y).toBe(original.y);
    });
  });

  describe('toString', () => {
    it('should contain the x coordinate', () => {
      const point = new Point(1, 2);

      expect(point.toString()).toContain(point.x);
    });

    it('should contain the y coordinate', () => {
      const point = new Point(1, 2);

      expect(point.toString()).toContain(point.y);
    });

    it('should match snapshot', () => {
      const point = new Point(1, 2);

      expect(point.toString()).toMatchSnapshot();
    });
  });

  describe('manhattanDistance', () => {
    it('should return the Manhattan distance for points on the same Y axis', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(0, 5);

      expect(Point.manhattanDistance(p1, p2)).toBe(5);
    });

    it('should return the Manhattan distance for points on the same X axis', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(5, 0);

      expect(Point.manhattanDistance(p1, p2)).toBe(5);
    });

    it('should be commutative', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(5, 0);

      const distance1 = Point.manhattanDistance(p1, p2);
      const distance2 = Point.manhattanDistance(p2, p1);

      expect(distance1).toEqual(distance2);
    });

    it('should return the Manhattan distance for any points', () => {
      const p1 = new Point(1, 1);
      const p2 = new Point(8, 0);

      expect(Point.manhattanDistance(p1, p2)).toBe(8);
    });
  });
});
