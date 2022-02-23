import { Item } from './item';
import { Position } from './position';

export class Shot extends Item {
  public constructor(
    ctx: CanvasRenderingContext2D
  , x: number
  , y: number
  , w: number
  , h: number
  , imagePath: string
  ) {
    super(ctx, x, y, w, h, 0, imagePath);

    this.speed = 0.96;
    this.vector = new Position(0.0, -1.0);
  }

  public set(x: number, y: number): void {
    this.position.set(x, y);
    this.life = 1;
  }

  public setSpeed(speed: number): void {
    if (speed != null && speed > 0) {
      this.speed = speed;
    }
  }

  public getSpeed(): number {
    return this.speed;
  }

  public isDead(): boolean {
    return this.life <= 0;
  }

  public update(): void {
    if (this.isDead()) { return; }

    if (this.position.y + this.height < 0) {
      this.life = 0;
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.rotationDraw();
  }
}
