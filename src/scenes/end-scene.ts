import { IGame } from "../game";
import { COLOR_BLACK, COLOR_WHITE, isMobile } from "../registry";
import { delay } from "../utils";
import { getGameSceneDimensions } from "./game-scene";
import { BaseScene, SceneName } from "./scene";

export const enum WinState {
  Win,
  Loose,
}

export class EndScene extends BaseScene {
  private winState: WinState;
  constructor(game: IGame, ...args: any[]) {
    super();

    this.winState = args[0];

    document.querySelector<HTMLStyleElement>(".cc")!.style.imageRendering = "auto";
    const sceneDimensions = getGameSceneDimensions(8);
    const { sceneWidth, sceneHeight } = sceneDimensions;
    game.resize(sceneWidth, sceneHeight);

    delay(500).then(() => {
      onclick = () => {
        onclick = null;
        game.changeScene(SceneName.Title);
      };
    });
  }
  update(dt: number): void {}
  draw(context: CanvasRenderingContext2D): void {
    const { width, height } = c;
    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, 0, width, height);

    context.fillStyle = COLOR_WHITE;

    const winText = (this.winState === WinState.Win) ? "You serve your master well!" : "You failed to feed your master.";

    context.font = "bold 1px Georgia";
    context.font = `bold ${(width * 0.9) / context.measureText(winText).width}px Georgia`;
    context.textAlign = "center";
    context.fillText(winText, width / 2, height / 2);

    context.font = "24px Arial";
    context.fillText((this.winState === WinState.Win) ? `${isMobile ? "tap" : "click"} to re-start` : "Try again or IT will feast on you.", width / 2, height * 0.6);
  }
  destroy(): void {
    onclick = null;
  }
}
