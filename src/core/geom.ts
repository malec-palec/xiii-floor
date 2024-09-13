export type Point = {
  x: number;
  y: number;
};

export const createPoint = (x = 0, y = x): Point => ({ x, y });

export function findIntersection(p1: Point, p2: Point, y3: number): Point {
  const x1 = p1.x;
  const y1 = p1.y;
  const x2 = p2.x;
  const y2 = p2.y;
  const k = (y2 - y1) / (x2 - x1);
  const b = y1 - k * x1;
  const x3 = (y3 - b) / k;
  return { x: x3, y: y3 };
}

export function line(p0: Point, p1: Point, drawFunc: (x: number, y: number) => void): void {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const N = Math.max(Math.abs(dx), Math.abs(dy));
  const divN = N === 0 ? 0.0 : 1.0 / N;
  const xstep = dx * divN;
  const ystep = dy * divN;
  let x = p0.x;
  let y = p0.y;
  for (let step = 0; step <= N; step++, x += xstep, y += ystep) {
    drawFunc(Math.round(x), Math.round(y));
  }
}
