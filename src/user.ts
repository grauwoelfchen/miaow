import { Item } from './item';
import { Position } from './position';
import { Shot } from './shot';

export class User extends Item {
  // shots
  private bites: Shot[];
  private winks: { left: Shot[], right: Shot[] };

  private isShooting: boolean;
  private isComming: boolean;

  private commingStart: number;
  private commingEndPosition: Position;

  // stats
  private time: number;
  private distance: number;
  private totalShots: number;

  public constructor(
    ctx: CanvasRenderingContext2D
  , x: number
  , y: number
  , w: number
  , h: number
  , imagePath: string
  ) {
    super(ctx, x, y, w, h, 0, imagePath);

    this.bites = [];
    this.winks = {
      left: []
    , right: []
    };

    this.speed = 3;

    this.isShooting = false;
    this.isComming = false;

    this.commingStart = 0;
    this.commingEndPosition = new Position(0, 0);

    this.time = 0.0;
    this.distance = 0;
    this.totalShots = 0;
  }

  public setBites(bites: Shot[]): void {
    this.bites = bites;
  }

  public setWinks(winks: { left: Shot[], right: Shot[] }): void {
    this.winks = winks;
  }

  public setComming(
    startX: number
  , startY: number
  , endX: number
  , endY: number
  ) {
    this.life = 1;
    this.isComming = true;
    this.commingStart = Date.now();
    this.position.set(startX, startY);
    this.commingEndPosition = new Position(endX, endY);
  }

  public isAllSet(): boolean {
    return !this.isComming;
  }

  public totalTime(): string {
    return this.time.toFixed(2);
  }

  public totalShotsCount(): string {
    return String(this.totalShots);
  }

  public totalDistance(): string {
    return String(this.distance);
  }

  public activeShotsCount(): string {
    return String(
      this.bites.filter((s: Shot) => !s.isDone()).length +
        this.winks.left.filter((w: Shot) => !w.isDone()).length +
        this.winks.right.filter((w: Shot) => !w.isDone()).length
    );
  }

  public update() {
    const justTime = Date.now();

    const time = (justTime - this.commingStart) / 1000; // seconds
    this.time = time;

    if (this.life <= 0) { return; }

    if (this.isComming === true) {
      let y = this.time * 50;
      if (y >= this.commingEndPosition.y) {
        this.isComming = false;
        y = this.commingEndPosition.y;
      }
      this.position.set(this.position.x, y);

      // tink
      const n = justTime % 100;
      if (n < 50) {
        this.ctx.globalAlpha = 0.5;
      }
    } else {
      if (window.KeyDown.ArrowLeft === true) {
        this.position.x -= this.speed;
        this.distance += this.speed;
      }
      if (window.KeyDown.ArrowRight === true) {
        this.position.x += this.speed;
        this.distance += this.speed;
      }
      if (window.KeyDown.ArrowUp === true) {
        this.position.y -= this.speed;
        this.distance += this.speed;
      }
      if (window.KeyDown.ArrowDown === true) {
        this.position.y += this.speed;
        this.distance += this.speed;
      }

      const tx = Math.min(Math.max(this.position.x, 0), this.ctx.canvas.width);
      const ty = Math.min(Math.max(this.position.y, 0), this.ctx.canvas.height);
      this.position.set(tx, ty);

      if (window.KeyDown.Shift === false) {
        this.isShooting = false;
      }

      if (window.KeyDown.Shift === true && this.isShooting === false) {
        for (const [i, _h] of this.bites.entries()) {
          if (this.bites[i].isDone()) {
            this.bites[i].setPower(2);
            this.bites[i].set(this.position.x, this.position.y);
            this.totalShots += 1;

            // moving left
            if (window.KeyDown.ArrowLeft === true) {
              setTimeout(() => {
                for (const [j, _l] of this.winks.left.entries()) {
                  if (this.winks.left[j].isDone()) {
                    const a = 260 * Math.PI / 180;
                    this.winks.left[j].set(this.position.x, this.position.y);
                    this.winks.left[j].setVectorFromAngle(a);
                    this.totalShots += 1;
                    break;
                  }
                }
              }, 100);
            }

            // moving right
            if (window.KeyDown.ArrowRight === true) {
              setTimeout(() => {
                for (const [k, _r] of this.winks.right.entries()) {
                  if (this.winks.right[k].isDone()) {
                    const a = 280 * Math.PI / 180;
                    this.winks.right[k].set(this.position.x, this.position.y);
                    this.winks.right[k].setVectorFromAngle(a);
                    this.totalShots += 1;
                    break;
                  }
                }
              }, 100);
            }

            break;
          }
        }
        this.isShooting = true;
      }
    }

    super.draw();
    this.ctx.globalAlpha = 1.0;
  }
}
