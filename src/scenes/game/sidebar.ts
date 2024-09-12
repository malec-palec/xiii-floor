import { Button } from "../../display/button";
import Container from "../../display/container";
import { FrameShape } from "../../display/shape";
import { isMobile, TILE_SIZE } from "../../registry";
import { LiftController, LiftModel } from "./lift";

export class Sidebar extends Container {
  width: number;
  height: number;
  constructor(
    [width, height, x = 0, y = 0]: [number, number, number, number],
    frameImage: HTMLCanvasElement,
    private model: LiftModel,
    controller: LiftController,
    resetGame: () => void,
  ) {
    super(x, y);
    this.width = width;
    this.height = height;

    const { floors } = model;

    const frame = new FrameShape(frameImage, width, height);

    const buttons: Button<number>[] = [];
    const numFloors = floors.length;
    for (let i = 0; i < numFloors; i++) {
      const floor = floors[i];
      if (floor.no === 13) continue;
      const tx = !isMobile ? i % 2 : ~~(i / 2);
      const ty = !isMobile ? numFloors / 2 - 1 - ~~(i / 2) : i % 2;
      const button = new Button(
        [TILE_SIZE * 3, TILE_SIZE * 3, TILE_SIZE + tx * (TILE_SIZE * 4), TILE_SIZE + ty * (TILE_SIZE * 4)],
        i,
        String(floor.no),
        !floor.isUnavailable,
        (floorIndex) => {
          if (model.isInputEnabled) controller.processButtonPress(floorIndex);
        },
      );
      buttons.push(button);
    }

    // TODO: add reset animation
    const resetButton = new Button(
      [TILE_SIZE * 3, TILE_SIZE * 3, TILE_SIZE, TILE_SIZE * 17],
      null,
      "R",
      true,
      resetGame,
    );

    this.children.push(frame, ...buttons, resetButton);
  }
  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);

    context.fillStyle = "White";
    context.font = "24px Arial";
    context.fillText(`STEPS: ${this.model.steps}`, TILE_SIZE, TILE_SIZE * 22);

    // drawDottedGrid(context, 0, 0, this.width, this.height, 16);
  }
}
