import { drawDottedGrid } from "../../canvas-utils";
import { Button } from "../../display/button";
import Container from "../../display/container";
import { FrameShape } from "../../display/shape";
import { isMobile } from "../../registry";

export class Sidebar extends Container {
  width: number;
  height: number;
  constructor(
    onButtonClick: (floorId: number) => void,
    frameImage: HTMLImageElement,
    sidebarSize: number,
    canvasSize: number,
    x = 0,
    y = 0,
  ) {
    super(x, y);

    this.width = isMobile ? canvasSize : sidebarSize;
    this.height = isMobile ? sidebarSize : canvasSize;

    const frame = new FrameShape(frameImage, this.width, this.height);

    const buttons: Button<number>[] = [];
    for (let i = 0; i < 10; i++) {
      const tx = !isMobile ? i % 2 : ~~(i / 2);
      const ty = !isMobile ? ~~(i / 2) : i % 2;
      const button = new Button(i, onButtonClick, 16 * 3, 16 * 3, 16 + tx * (16 * 4), 16 + ty * (16 * 4));
      buttons[i] = button;
    }
    this.children.push(frame, ...buttons);
  }
  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);

    drawDottedGrid(context, 0, 0, this.width, this.height, 16);
  }
}
