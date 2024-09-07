import { sine } from "../core/easing";
import { IGame } from "../game";
import { COLOR_BLACK, COLOR_WHITE, isMobile } from "../registry";
import { BaseScene, SceneName } from "./scene";

export class TitleScene extends BaseScene {
  private doorWidth: number;
  private t = 0;

  constructor(game: IGame) {
    super();

    // TODO: get game size from the GameScene
    const scaleMult = 2;
    game.resize((600 + 200 * +!isMobile) * scaleMult, (600 + 200 * +isMobile) * scaleMult);

    this.doorWidth = c.width / 2;

    onclick = () => {
      onclick = null;

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
    this.t++;
    this.t %= 400;
  }
  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = COLOR_WHITE;
    context.fillRect(0, 0, c.width, c.height);

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, 0, this.doorWidth, c.height);
    context.fillRect(c.width / 2 + (c.width / 2 - this.doorWidth), 0, this.doorWidth, c.height);

    const text = "XIII FLOOR";
    context.font = "bold 1px Georgia";
    const fontSize = (c.width * 0.9) / context.measureText(text).width;
    context.font = `bold ${fontSize}px Georgia`;
    context.fillStyle = COLOR_WHITE;
    context.textAlign = "center";
    context.fillText(text, c.width / 2, c.height / 2);

    if (Math.floor(this.t / 40) % 2 === 0) return;

    context.font = "32px Arial";
    context.fillText("click to start", c.width / 2, c.height * 0.6);
  }
  destroy(): void {
    onclick = null;
  }
}
