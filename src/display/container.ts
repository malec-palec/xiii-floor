import { Event, MouseEvent } from "../core/event";
import { createPoint, IDisplayObject, Point } from "./display-object";

export default class Container implements IDisplayObject {
  isVisible = true;
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
  draw(context: CanvasRenderingContext2D): void {
    if (!this.isVisible) return;
    this.children.forEach((child) => {
      context.save();

      context.translate(child.position.x, child.position.y);
      // context.rotate(child.rotation);
      // context.globalAlpha = child.alpha * this.alpha;
      context.scale(child.scale.x, child.scale.y);
      child.draw(context);

      context.restore();
    });
  }
  dispatchEvent(event: Event): void {
    const { children, position } = this;

    if (event instanceof MouseEvent) {
      event.mouseX -= position.x;
      event.mouseY -= position.y;
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      child.dispatchEvent(event);
      if (event.isAccepted) {
        break;
      }
    }
    if (!event.isAccepted) {
      this.handleEvent(event);
    }
  }
  protected handleEvent(event: Event): void {}
}
