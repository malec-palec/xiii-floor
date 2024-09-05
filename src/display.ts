export type Point = {
  x: number;
  y: number;
};

export const createPoint = (x = 0, y = x): Point => ({ x, y });

export interface IDisplayObject {
  position: Point;
  scale: Point;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
