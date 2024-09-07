import { IGame } from "../game";
import { isMobile } from "../registry";
import { logDebug } from "../utils";
import { BaseScene } from "./scene";

export class GameScene extends BaseScene {
  constructor(game: IGame) {
    super();
    game.resize(600 + 200 * +!isMobile, 600 + 200 * +isMobile);
  }
  update(dt: number): void {}
  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "green";
    context.fillRect(0, 0, c.width, c.height);
  }
  onClick(mouseX: number, mouseY: number): void {
    logDebug("You are here!");
  }
}
