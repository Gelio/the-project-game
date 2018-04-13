export class PlayerIdGenerator {
  private nextPlayerId = 1;

  public getNextPlayerId(): number {
    return this.nextPlayerId++;
  }
}
