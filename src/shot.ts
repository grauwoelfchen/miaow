import { Item } from './item';
import { Position } from './position';

export class Shot extends Item {
  private power: number;
  private targets: Item[];

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

    this.power = 1;
    this.targets = [];
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

  public setPower(power: number): void {
    if (power != null) {
      this.power = power;
    }
  }

  public setTargets(targets: Item[]): void {
    if (targets != null && Array.isArray(targets) && targets.length > 0) {
      this.targets = targets;
    }
  }

  public isDone(): boolean {
    return this.isGone();
  }

  public update(): void {
    if (this.isDone()) { return; }

    // if shot goes out of screen
    if (this.position.y + this.height < 0) {
      this.life = 0;
    }

    // move
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    // check collision for targets
    this.targets.map((t: Item) => {
      if (this.isDone() || t.isGone()) { return; }

      const d = this.position.getDistance(t.getPosition());
      if (d <= (this.width + t.width) / 4) {
        t.setLife(t.getLife() - this.power);
        this.life = 0;
      }
    });

    this.rotationDraw();
  }
}
