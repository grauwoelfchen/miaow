export class CanvasUtility {
  private canvasElement: HTMLCanvasElement | null;
  private context2d: CanvasRenderingContext2D | null;

  public constructor(element: HTMLCanvasElement | null) {
    this.canvasElement = null;
    this.context2d = null;

    if (element != null) {
      this.canvasElement = element;

      if (this.canvas != null) {
        this.context2d = this.canvas.getContext('2d');
      }
    }
  }

  public get canvas(): HTMLCanvasElement | null {
    return this.canvasElement;
  }

  public get context(): CanvasRenderingContext2D | null {
    return this.context2d;
  }

  public drawText(
    text: string
  , x: number
  , y: number
  , color: string
  , width: number
  ): void {
    if (this.context2d != null) {
      if (color != null) {
        this.context2d.fillStyle = color;
      }
      this.context2d.fillText(text, x, y, width);
    }
  }

  public drawRect(
    x: number
  , y: number
  , width: number
  , height: number
  , color: string
  ): void {
    if (this.context2d != null) {
      if (color != null) {
        this.context2d.fillStyle = color;
      }
      this.context2d.fillRect(x, y, width, height);
    }
  }
}
