import { sine } from "../../core/easing";
import { findIntersection, line } from "../../core/geom";
import { Tweener } from "../../core/tweener";
import { DisplayObject } from "../../display/display-object";
import MovieClip from "../../display/movie-clip";
import { COLOR_BLACK, COLOR_WHITE } from "../../registry";

export class ElevatorShaft extends DisplayObject {
  private borderSize = 2;
  constructor(
    private fencePattern: CanvasPattern,
    width: number,
    height: number,
    x = 0,
    y = 0,
  ) {
    super(width, height, x, y);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { fencePattern, width, height, borderSize } = this;

    context.fillStyle = COLOR_BLACK;
    context.fillRect(-borderSize, 0, width + borderSize * 2, height);

    context.fillStyle = fencePattern;
    context.fillRect(0, 0, width, height);
  }
}

export class Elevator extends DisplayObject {
  readonly chars: MovieClip[] = [];
  private borderHeight = 2;
  private doorWidth: number = 0;
  // TODO: make tweener global
  constructor(
    [width, height, x = 0, y = 0]: [number, number, number, number],
    private tweener: Tweener,
  ) {
    super(width, height, x, y);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { width, height, borderHeight, doorWidth } = this;

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, 0, width, -height - borderHeight);
    context.fillRect(width / 4, 0, width / 2, -height - borderHeight - 1);

    context.fillRect(width / 2 - 8, 0, 1, -this.position.y);
    context.fillRect(width / 2 + 9, 0, 1, -this.position.y);

    context.fillStyle = COLOR_WHITE;
    context.fillRect(0, -height, width, height);

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, 0, doorWidth, -height - borderHeight);
    context.fillRect(width - doorWidth, 0, doorWidth, -height - borderHeight);

    context.fillStyle = COLOR_WHITE;
    context.globalAlpha = 0.4;
    for (let px = doorWidth; px < width - doorWidth; px++) {
      const p = findIntersection({ x: px, y: -height }, { x: width, y: -height - width * 1.5 }, 0);
      line(p, { x: px, y: -height }, (x, y) => {
        context.fillRect(x, y, 1, 1);
      });
    }
    context.globalAlpha = 1;
  }
  open(): Promise<void> {
    const { tweener, width, chars } = this;
    return new Promise((resolve) => {
      chars.forEach((char) => (char.isVisible = true));
      tweener.tweenProperty(
        20,
        width / 2,
        0,
        sine,
        (v) => (this.doorWidth = v),
        () => {
          this.doorWidth = 0;
          resolve();
        },
      );
    });
  }
  moveTo(targetY: number, duration: number): Promise<void> {
    const { tweener, position, chars } = this;
    return new Promise((resolve) => {
      tweener.tweenProperty(
        duration,
        position.y,
        targetY,
        sine,
        (py) => {
          position.y = py;
          chars.forEach((char) => (char.position.y = py));
        },
        () => {
          position.y = targetY;
          chars.forEach((char) => (char.position.y = targetY));
          resolve();
        },
      );
    });
  }
  close(): Promise<void> {
    const { tweener, width, chars } = this;
    return new Promise((resolve) => {
      tweener.tweenProperty(
        20,
        0,
        width / 2,
        sine,
        (v) => (this.doorWidth = v),
        () => {
          this.doorWidth = width / 2;
          chars.forEach((char) => (char.isVisible = false));
          resolve();
        },
      );
    });
  }
  getCharPlace(index: number, capacity: number): number {
    const { position, width } = this;
    return position.x + width - (index + 1) * (width / (capacity + 1));
  }
}
