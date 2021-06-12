export class Position {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public set (x: number, y: number): void {
    if (x != null) { this.x = x; }
    if (y != null) { this.y = y; }
  }
}
