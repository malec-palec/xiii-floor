import { createPoint, DisplayObject } from "./display-object";

export default class Sprite extends DisplayObject {
  pivot = createPoint();
  constructor(
    public image: DrawImageSource,
    x = 0,
    y = 0,
  ) {
    super(image.width, image.height, x, y);
  }
  draw(context: CanvasRenderingContext2D): void {
    if (!this.isVisible) return;
    const { image, pivot } = this;
    const { width, height } = image;
    context.drawImage(image, 0, 0, width, height, -width * pivot.x, -height * pivot.y, width, height);
  }
}
