import { IAssetsProvider } from "./assets";
import { ITweenerProvider, Tweener } from "./core/tweener";
import { GameScene } from "./scenes/game-scene";
import { IScene, ISceneManager, SceneName } from "./scenes/scene";
import { TitleScene } from "./scenes/title-scene";
import { clamp } from "./utils";

export interface IGame extends ISceneManager, IAssetsProvider, ITweenerProvider {
  resize(width: number, height: number): void;
}

export class Game implements IGame {
  private context: CanvasRenderingContext2D;
  private scene: IScene;

  tweener = new Tweener();

  constructor(public assets: HTMLImageElement[]) {
    this.context = c.getContext("2d")!;
    this.scene = new GameScene(this);

    c.onclick = ({ clientX, clientY }) => {
      const rect = c.getBoundingClientRect();
      const scaledWidth = (c.width * c.clientHeight) / c.height;
      this.scene.onClick(
        (clamp(clientX - (c.clientWidth - scaledWidth) / 2, 0, scaledWidth) * c.width) / scaledWidth,
        ((clientY - rect.top) * c.height) / c.clientHeight,
      );
    };
  }

  changeScene(name: SceneName): void {
    const { scene, context } = this;
    scene.destroy();
    context.clearRect(0, 0, c.width, c.height);
    let newScene: IScene;
    switch (name) {
      case SceneName.Title:
        newScene = new TitleScene(this);
        break;
      case SceneName.Game:
        newScene = new GameScene(this);
        break;
    }
    this.scene = newScene;
  }

  update(dt: number): void {
    const { scene, tweener, context } = this;
    scene.update(dt);
    tweener.update(dt);

    scene.draw(context);
  }

  resize(width: number, height: number): void {
    c.width = width;
    c.height = height;
    this.context.imageSmoothingEnabled = false;
  }

  // TODO: show message on top: "The game is intended to be played in portrait mode. Please, rotate the device."
  handleRotation(): void {
    const angle = screen.orientation.angle;
    if (angle === 0 || angle === 180) {
      // Portrait mode
      c.style.transform = "rotate(0deg)";
      c.style.width = "100vw";
    } else if (angle === 90 || angle === -90) {
      // Landscape mode
      c.style.transform = "rotate(-90deg)";
      c.style.width = "auto";
    }
  }
}
