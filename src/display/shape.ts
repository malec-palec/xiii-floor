import { drawSlices } from "../canvas-utils";
import { DisplayObject } from "./display-object";

export class RectShape extends DisplayObject {
  constructor(
    public fill: string | CanvasPattern,
    width: number,
    height: number,
    x = 0,
    y = 0,
  ) {
    super(width, height, x, y);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { fill, width, height } = this;
    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);
  }
}

export class FrameShape extends DisplayObject {
  constructor(
    public frame: DrawImageSource,
    width: number,
    height: number,
    x = 0,
    y = 0,
  ) {
    super(width, height, x, y);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { frame, width, height } = this;
    drawSlices(frame, context, 0, 0, width, height);
  }
}
