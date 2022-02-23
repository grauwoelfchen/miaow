import { Item } from './item';
import { Shot } from './shot';

export class Friend extends Item {
  private hearts: Shot[];
  private kind: string;

  public constructor(
    ctx: CanvasRenderingContext2D
  , x: number
  , y: number
  , w: number
  , h: number
  , imagePath: string
  ) {
    super(ctx, x, y, w, h, 0, imagePath);

    this.kind = 'default';
    this.hearts = [];

    this.speed = 1.18;
    this.frame = 0;
  }

  public set(
    x: number
  , y: number
  , life: number = 1
  , kind: string = 'default'
  ) {
    this.position.set(x, y);
    this.life = life;
    this.kind = kind;
    this.frame = 0;
  }

  public setHearts(hearts: Shot[]): void {
    this.hearts = hearts;
  }

  public fire(
    x: number = 0.0
  , y: number = 1.0
  ) {
    for (const [i, h] of this.hearts.entries()) {
      if (h.isDead()) {
        this.hearts[i].set(this.position.x, this.position.y);
        this.hearts[i].setSpeed(4.4);
        this.hearts[i].setVector(x, y);
        break;
      }
    }
  }

  public update() {
    if (this.life <= 0) {
      // TODO
      return;
    }

    switch (this.kind) {
      case 'default':
      default:
        if (this.frame === 45) {
          this.fire();
        }
        break;
    }

    // over bottom line
    if (this.position.y - this.height > this.ctx.canvas.height) {
      this.life = 0;
    }

    // see setVector()
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    this.draw();

    ++this.frame;
  }
}
