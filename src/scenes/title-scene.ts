import { sine } from "../core/easing";
import { IGame } from "../game";
import { COLOR_BLACK, COLOR_WHITE, isMobile } from "../registry";
import { getGameSceneDimensions } from "./game-scene";
import { BaseScene, SceneName } from "./scene";

const titleText = "XIII FLOOR";

export class TitleScene extends BaseScene {
  private doorWidth: number;
  private frameCounter = 0;

  constructor(game: IGame) {
    super();
    
    const numFloors = 8;
    const { sceneWidth, sceneHeight } = getGameSceneDimensions(numFloors);
    const scaleMult = 2;
    game.resize(sceneWidth * scaleMult, sceneHeight * scaleMult);

    this.doorWidth = c.width / 2;

    onclick = () => {
      onclick = null;
      // TODO: tune tween
      game.tweener.tweenProperty(
        30,
        this.doorWidth,
        0,
        sine,
        (width) => (this.doorWidth = width),
        () => {
          game.changeScene(SceneName.Game);
        },
      );
    };
  }
  update(dt: number): void {
    this.frameCounter = (this.frameCounter + 1) % 1000;
  }
  draw(context: CanvasRenderingContext2D): void {
    const { doorWidth, frameCounter } = this;
    const { width, height } = c;

    context.fillStyle = COLOR_WHITE;
    context.fillRect(0, 0, width, height);

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, 0, doorWidth, height);
    context.fillRect(width - doorWidth, 0, doorWidth, height);

    context.fillStyle = COLOR_WHITE;

    context.font = "bold 1px Georgia";
    context.font = `bold ${(width * 0.9) / context.measureText(titleText).width}px Georgia`;
    context.textAlign = "center";
    context.fillText(titleText, width / 2, height / 2);

    if (~~(frameCounter / 50) % 2 === 0) return;

    context.font = "32px Arial";
    context.fillText(`${isMobile ? "tap" : "click"} to start`, width / 2, height * 0.6);
  }
  destroy(): void {
    onclick = null;
  }
}
