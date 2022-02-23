import { Position } from './position';

export abstract class Item {
  protected ctx: CanvasRenderingContext2D;
  protected image: HTMLImageElement;

  protected angle: number;
  protected vector: Position;

  protected position: Position;
  protected width: number;
  protected height: number;

  protected speed: number;
  protected frame: number;

  protected life: number;

  protected ready: boolean;

  protected constructor(
    ctx: CanvasRenderingContext2D
  , x: number
  , y: number
  , w: number
  , h: number
  , life: number
  , imagePath: string
  ) {
    this.ctx = ctx;

    this.angle = 270 * Math.PI / 180;
    this.vector = new Position(0, 0);

    this.position = new Position(x, y);
    this.width = w;
    this.height = h;

    this.speed = 0;
    this.frame = 0;

    this.life = life;

    this.ready = false;

    this.image = new Image();
    this.image.addEventListener('load', () => {
      this.ready = true;
    }, false);
    this.image.src = imagePath;
  }

  public isReady(): boolean {
    return this.ready;
  }

  public isTired(): boolean {
    return this.life <= 0;
  }

  // as a friend ;)
  public isCharmed(): boolean {
    return this.life <= 0;
  }

  public setVectorFromAngle(angle: number): void {
    this.angle = angle;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    this.setVector(cos, sin);
  }

  public setVector(x: number, y: number): void {
    this.vector.set(x, y);
  }

  public getHeight(): number {
    return this.height;
  }

  protected rotationDraw(): void {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.angle - Math.PI * 1.5);

    const offsetX = this.width / 2;
    const offsetY = this.height / 2;

    this.ctx.drawImage(
      this.image,
      -offsetX,
      -offsetY,
      this.width,
      this.height
    );
    this.ctx.restore();
  }

  protected draw(): void {
    const offsetX = this.width / 2;
    const offsetY = this.height / 2;

    this.ctx.drawImage(
      this.image
    , this.position.x - offsetX
    , this.position.y - offsetY
    , this.width
    , this.height
    );
  }
}

