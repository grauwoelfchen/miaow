import { Position } from './position';

export class Dispersion {
  private ctx: CanvasRenderingContext2D;
  private radius: number;
  private count: number;
  private duration: number;
  private color: string;

  private fragments: number[]; // size
  private fragmentBaseSize: number;

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
  , color: string = '#61484b'
  ) {
    this.ctx = ctx;
    this.radius = radius;
    this.count = count;
    this.duration = duration;
    this.color = color;

    this.alive = false;
    this.startTime = 0;
    this.positions = [];
    this.vectors = [];

    this.fragments = [];
    this.fragmentBaseSize = size;
  }

  public set(x: number, y: number): void {
    for (let i = 0; i < this.count; ++i) {
      this.positions[i] = new Position(x, y);
      const r = Math.random() * Math.PI * 2.0;
      const sin = Math.sin(r);
      const cos = Math.cos(r);
      const rnd = Math.random();
      this.vectors[i] = new Position(cos * rnd, sin * rnd);
      this.fragments[i] = (Math.random() * 0.5 + 0.5) * this.fragmentBaseSize;
    }
    this.alive = true;
    this.startTime = Date.now();
  }

  public isAlive(): boolean {
    return this.alive === true;
  }

  public update(): void {
    if (!this.isAlive()) { return; }

    const time = (Date.now() - this.startTime) / 1000;
    // clamp value: 0.0 - 1.0
    const ease = this.simpleEaseIn(1.0 - Math.min(time / this.duration, 1.0));
    const progress = 1.0 - ease;

    const s = 1.0 - progress;

    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = s;

    const s = 1.0 - progress;

    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = s;

    for (let i = 0; i < this.positions.length; ++i) {
      const d = this.radius * progress;
      const x = this.positions[i].x + this.vectors[i].x * d;
      const y = this.positions[i].y + this.vectors[i].y * d;

      this.ctx.fillRect(
        x - this.fragments[i] / 2,
        y - this.fragments[i] / 2,
        this.fragments[i] * s,
        this.fragments[i] * s
      );
    }

    if (progress >= 1.0) {
      this.alive = false;
    }
  }

  private simpleEaseIn(t: number): number {
    return t * t * t;
  }
}
