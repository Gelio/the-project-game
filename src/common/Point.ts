export class Point {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static manhattanDistance(point1: Point, point2: Point): number {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
  }
}
