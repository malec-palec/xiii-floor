import { Event, IEventDispatcher } from "../core/event";
import { createPoint, Point } from "../core/geom";

export interface IDisplayObject extends IEventDispatcher {
  isVisible: boolean;
  position: Point;
  scale: Point;
  update(dt: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

export class DisplayObject implements IDisplayObject {
  isVisible = true;
  position: Point;
  scale = createPoint(1);
  constructor(
    public width: number,
    public height: number,
    x = 0,
    y = 0,
  ) {
    this.position = { x, y };
  }
  update(dt: number): void {}
  draw(context: CanvasRenderingContext2D): void {}
  dispatchEvent(event: Event): void {
    if (!event.isAccepted) {
      this.handleEvent(event);
    }
  }
  protected handleEvent(event: Event): void {}
}
