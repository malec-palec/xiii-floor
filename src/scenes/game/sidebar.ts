import { drawDottedGrid } from "../../canvas-utils";
import { Button } from "../../display/button";
import Container from "../../display/container";
import { FrameShape } from "../../display/shape";
import { isMobile } from "../../registry";
import { FloorData } from "./lift";

export class Sidebar extends Container {
  width: number;
  height: number;
  constructor(
    [width, height, x = 0, y = 0]: [number, number, number, number],
    onButtonClick: (floorIndex: number) => void,
    frameImage: HTMLCanvasElement,
    floors: FloorData[],
  ) {
    super(x, y);
    this.width = width;
    this.height = height;

    const frame = new FrameShape(frameImage, width, height);

    const buttons: Button<number>[] = [];
    const numFloors = floors.length;
    for (let i = 0; i < numFloors; i++) {
      const floor = floors[i];
      const tx = !isMobile ? i % 2 : ~~(i / 2);
      const ty = !isMobile ? numFloors / 2 - 1 - ~~(i / 2) : i % 2;
      const button = new Button(
        [16 * 3, 16 * 3, 16 + tx * (16 * 4), 16 + ty * (16 * 4)],
        i,
        floor.no === 13 ? "" : String(floor.no),
        !floor.isUnavailable,
        onButtonClick,
      );
      buttons[i] = button;
    }

    // resetButton
    // undoButton

    this.children.push(frame, ...buttons);
  }
  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
    drawDottedGrid(context, 0, 0, this.width, this.height, 16);
  }
}
