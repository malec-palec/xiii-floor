import Container from "../../display/container";
import { COLOR_BLACK, COLOR_WHITE } from "../../registry";

export class GameArea extends Container {
  constructor(
    private gameAreaSize: number,
    private floorHeight: number,
    private wallSize: number,
    private numFloors: number,
    x = 0,
    y = 0,
  ) {
    super(x, y);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { gameAreaSize, numFloors, floorHeight, wallSize } = this;
    context.fillStyle = COLOR_WHITE;
    context.fillRect(0, 0, gameAreaSize, gameAreaSize);

    super.draw(context);

    // draw floors
    context.fillStyle = COLOR_BLACK;
    for (let i = 0; i <= numFloors; i++) {
      context.fillRect(0, floorHeight * i, gameAreaSize, wallSize);
    }
  }
}
