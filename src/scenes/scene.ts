export const enum SceneName {
  Title,
  Game,
}

export interface IScene {
  update(dt: number): void;
  draw(context: CanvasRenderingContext2D): void;
  onClick(mouseX: number, mouseY: number): void;
  destroy(): void;
}

export interface ISceneManager {
  changeScene(sceneName: SceneName): void;
}

export class BaseScene implements IScene {
  update(dt: number): void {}
  draw(context: CanvasRenderingContext2D): void {}
  onClick(mouseX: number, mouseY: number): void {}
  destroy(): void {}
}
