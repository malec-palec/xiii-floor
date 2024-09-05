import { createPoint, IDisplayObject, Point } from "./display";

export default class Container implements IDisplayObject {
  children: IDisplayObject[] = [];
  position: Point;
  scale: Point;
  constructor(x = 0, y = 0, scaleXY = 1) {
    this.position = { x, y };
    this.scale = createPoint(scaleXY);
  }
  update(dt: number): void {
    this.children.forEach((child) => {
      child.update(dt);
    });
  }
  draw(ctx: CanvasRenderingContext2D): void {
    const { position, scale } = this;
    this.children.forEach((child) => {
      ctx.save();

      ctx.translate(position.x + child.position.x, position.y + child.position.y);
      // ctx.rotate(child.rotation);
      // ctx.globalAlpha = child.alpha * this.alpha;
      ctx.scale(scale.x * child.scale.x, scale.y * child.scale.y);
      child.draw(ctx);

      ctx.restore();
    });
  }
}
