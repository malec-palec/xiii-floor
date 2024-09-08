import { Event } from "../core/event";

export type Point = {
  x: number;
  y: number;
};

export const createPoint = (x = 0, y = x): Point => ({ x, y });

export interface IDisplayObject {
  position: Point;
  scale: Point;
  update(dt: number): void;
  draw(context: CanvasRenderingContext2D): void;
  dispatchEvent(event: Event): void;
}

export class DisplayObject implements IDisplayObject {
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
