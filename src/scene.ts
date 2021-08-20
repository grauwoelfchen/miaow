type processor = (time: number) => void;

export class Scene {
  public name: string;
  public processorFunc: processor;

  public constructor() {
    this.name = '';
    this.processorFunc = (_: number) => { return; };
  }
}
