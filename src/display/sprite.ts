import { DisplayObject } from "./display-object";

export default class Sprite extends DisplayObject {
  pivot = { x: 0, y: 0 };
  constructor(
    public image: DrawImageSource,
    x = 0,
    y = 0,
  ) {
    super(image.width, image.height, x, y);
  }
  update(dt: number): void {}
  draw(context: CanvasRenderingContext2D): void {
    const { image, pivot } = this;
    const { width, height } = image;
    context.drawImage(image, 0, 0, width, height, -width * pivot.x, -height * pivot.y, width, height);
  }
}
