type processor = (time: number) => void;

export class Scene {
  public name: string = '';
  public processorFunc: processor = (_: number) => { return; };
}
