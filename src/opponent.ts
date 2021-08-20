import { Item } from './item';

export class Opponent extends Item {
  public constructor(
    ctx: CanvasRenderingContext2D
  , x: number
  , y: number
  , w: number
  , h: number
  , imagePath: string
  ) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.speed = 1.18;
  }

  public set(
    x: number
  , y: number
  , life: number = 1
  ) {
    this.position.set(x, y);
    this.life = life;
  }

  public update() {
    if (this.life <= 0) {
      // TODO
      return;
    }

    // over bottom line
    if (this.position.y - this.height > this.ctx.canvas.height) {
      this.life = 0;
    }

    // see setVector()
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    this.draw();
  }
}
