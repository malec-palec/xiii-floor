import { colorizeImage, drawRegion, eraseColor, scalePixelated, wrapCanvasFunc } from "./canvas-utils";

export class Game {
  private atlas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(atlas: HTMLImageElement) {
    let canvas = drawRegion(atlas, 0, 0, 9, 9);
    canvas = wrapCanvasFunc(eraseColor, canvas);
    canvas = wrapCanvasFunc(scalePixelated, canvas, 4);
    canvas = colorizeImage(canvas, "black");
    
    this.atlas = canvas;
    this.context = c.getContext("2d")!;
  }
  update(dt: number) {}
  draw() {
    const { context } = this;
    context.fillStyle = "grey";
    context.fillRect(0, 0, c.width, c.height);
    context.drawImage(this.atlas, 5, 5);
    context.drawImage(this.atlas, 5 + 9 * 4, 5);
    context.drawImage(this.atlas, 5 + 9 * 4 * 2, 5);
  }
}
