import { sine } from "../../core/easing";
import { Tweener } from "../../core/tweener";
import { DisplayObject } from "../../display/display-object";
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
  private borderHeight = 2;
  doorWidth: number = 0;
  // TODO: make tweener global
  constructor(
    private tweener: Tweener,
    width: number,
    height: number,
    x = 0,
    y = 0,
  ) {
    super(width, height, x, y);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { width, height, borderHeight, doorWidth } = this;

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, -height - borderHeight, width, borderHeight);

    context.fillStyle = COLOR_WHITE;
    context.fillRect(0, -height, width, height);

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, -height, doorWidth, height);
    context.fillRect(width - doorWidth, -height, doorWidth, height);
  }
  open(): Promise<void> {
    const { tweener, width } = this;
    return new Promise((resolve) => {
      tweener.tweenProperty(
        30,
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
    const { tweener, position } = this;
    return new Promise((resolve) => {
      tweener.tweenProperty(
        duration,
        position.y,
        targetY,
        sine,
        (py) => (position.y = py), // | 0
        () => {
          position.y = targetY;
          resolve();
        },
      );
    });
  }
  close(): Promise<void> {
    const { tweener, width } = this;
    return new Promise((resolve) => {
      tweener.tweenProperty(
        30,
        0,
        width / 2,
        sine,
        (v) => (this.doorWidth = v),
        () => {
          this.doorWidth = width / 2;
          resolve();
        },
      );
    });
  }
}
