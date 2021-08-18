import { Scene } from './scene';

export class Manager {
  private registry: { [key: string]: Scene } = {};
  private activeScene?: Scene = undefined;

  public frame: number = 0;
  public time: number = 0.0;

  public constructor() {
    this.frame = 0;
    this.time = 0.0;
  }

  public registerScene(name: string, processorFunc: (time: number) => void) {
    const scene: Scene = { name, processorFunc };
    this.registry[scene.name] = scene;
  }

  public switchScene(name: string) {
    if (this.registry.hasOwnProperty(name) !== true) {
      return;
    }
    this.activeScene = this.registry[name];
    this.time = Date.now();
    this.frame = -1;
  }

  public getCurrentSceneName(): string {
    if (this.activeScene === undefined) {
      return '';
    }
    return this.activeScene.name;
  }

  public update() {
    const scene = this.activeScene;
    if (scene === undefined) {
      return;
    }
    const time = (Date.now() - this.time) / 1000;
    scene.processorFunc(time);
    this.frame += 1;
  }
}
