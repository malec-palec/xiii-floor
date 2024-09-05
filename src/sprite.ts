import { IDisplayObject, Point } from "./display";

export default class Sprite implements IDisplayObject {
  position: Point;
  scale = { x: 2, y: 2 };
  pivot = { x: 0.5, y: 1 };
  constructor(
    public image: DrawImageSource,
    x = 0,
    y = 0,
  ) {
    this.position = { x, y };
  }
  update(dt: number): void {}
  draw(context: CanvasRenderingContext2D): void {
    const { image, pivot } = this;
    const { width, height } = image;
    context.drawImage(image, 0, 0, width, height, -width * pivot.x, -height * pivot.y, width, height);
  }
  get width(): number {
    return this.image.width;
  }
  get height(): number {
    return this.image.height;
  }
}
