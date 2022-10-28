import { Position } from './position';

export class Dispersion {
  private ctx: CanvasRenderingContext2D;
  private radius: number;
  private count: number;
  private size: number;
  private duration: number;
  private color: string;

  private alive: boolean;
  private startTime: number;
  private positions: Position[];
  private vectors: Position[];

  public constructor(
    ctx: CanvasRenderingContext2D
  , radius: number
  , count: number
  , size: number
  , duration: number
  , color: string = '#d6d6d6'
  ) {
    this.ctx = ctx;
    this.radius = radius;
    this.count = count;
    this.size = size;
    this.duration = duration;
    this.color = color;

    this.alive = false;
    this.startTime = 0;
    this.positions = [];
    this.vectors = [];
  }

  public set(x: number, y: number): void {
    for (let i = 0; i < this.count; ++i) {
      this.positions[i] = new Position(x, y);
      const r = Math.random() * Math.PI * 2.0;
      const sin = Math.sin(r);
      const cos = Math.cos(r);
      this.vectors[i] = new Position(cos, sin);
    }
    this.alive = true;
    this.startTime = Date.now();
  }

  public isAlive(): boolean {
    return this.alive === true;
  }

  public update(): void {
    if (!this.isAlive()) { return; }

    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = 0.5;

    const time = (Date.now() - this.startTime) / 1000;
    // clamp value: 0.0 - 1.0
    const progress = Math.min(time / this.duration, 1.0);

    for (let i = 0; i < this.positions.length; ++i) {
      const d = this.radius * progress;
      const x = this.positions[i].x + this.vectors[i].x * d;
      const y = this.positions[i].y + this.vectors[i].y * d;

      this.ctx.fillRect(
        x - this.size / 2,
        y - this.size / 2,
        this.size,
        this.size
      );
    }

    if (progress >= 1.0) {
      this.alive = false;
    }
  }
}
