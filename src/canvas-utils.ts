import type { Tail } from "./types";
import { createObjectPool } from "./utils";

export const canvasPool = createObjectPool(
  () => {
    return document.createElement("canvas");
  },
  (canvas) => {
    const context = canvas.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);
  },
);

export const wrapCanvasFunc = <
  T extends (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    src: HTMLCanvasElement,
    ...rest: any[]
  ) => HTMLCanvasElement,
  K extends Tail<Tail<Parameters<T>>>,
>(
  func: T,
  source: HTMLCanvasElement,
  ...rest: Tail<K>
): HTMLCanvasElement => {
  const canvas = canvasPool.alloc();
  const dest = func(canvas, canvas.getContext("2d")!, source, ...rest);
  canvasPool.free(source);
  return dest;
};

/* export const getOpaqueBounds = (
  canvas: HTMLCanvasElement,
  context = canvas.getContext("2d")!,
): [number, number, number, number] => {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight),
    rgba = imageData.data;

  let x: number, y: number, i: number;
  let minX = canvasWidth,
    minY = canvasHeight,
    maxX = 0,
    maxY = 0;

  for (y = 0; y < canvasHeight; y++) {
    for (x = 0; x < canvasWidth; x++) {
      i = (x + y * canvasWidth) * 4;
      if (rgba[i] !== 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return [minX, minY, maxX, maxY];
};

export const cropAlpha = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  [minX, minY, maxX, maxY]: [number, number, number, number],
): HTMLCanvasElement => {
  canvas.width = maxX - minX + 1;
  canvas.height = maxY - minY + 1;
  context.drawImage(image, -minX, -minY);
  return canvas;
}; */

export const scalePixelated = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: DrawImageSource,
  scaleX: number,
  scaleY = scaleX,
): HTMLCanvasElement => {
  canvas.width = <number>image.width * scaleX;
  canvas.height = <number>image.height * scaleY;
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
};

export const getImageRegion = (
  imageSource: DrawImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx = 0,
  dy = 0,
): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = canvasPool.alloc();
  const context = canvas.getContext("2d")!;
  canvas.width = sw;
  canvas.height = sh;
  context.drawImage(imageSource, sx, sy, sw, sh, dx, dy, sw, sh);
  return [canvas, context];
};

export const eraseColorInPlace = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  r = 0,
  g = r,
  b = r,
): void => {
  const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  const rgba = imgData.data;
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i] === r && rgba[i + 1] === g && rgba[i + 2] === b) {
      rgba[i + 3] = 0;
    }
  }
  context.putImageData(imgData, 0, 0);
};

export const colorizeInPlace = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, color: string): void => {
  context.fillStyle = color;
  context.globalCompositeOperation = "source-in";
  context.fillRect(0, 0, canvas.width, canvas.height);
};

export const drawSlices = (
  img: DrawImageSource,
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  width: number,
  height: number,
): void => {
  const s = img.width / 3;

  // define the 9 parts as [x, y, w, h]
  const part1 = [0, 0, s, s] as const;
  const part2 = [s, 0, s, s] as const;
  const part3 = [s * 2, 0, s, s] as const;
  const part4 = [0, s, s, s] as const;
  const part5 = [s, s, s, s] as const;
  const part6 = [s * 2, s, s, s] as const;
  const part7 = [0, s * 2, s, s] as const;
  const part8 = [s, s * 2, s, s] as const;
  const part9 = [s * 2, s * 2, s, s] as const;

  ctx.save();
  ctx.translate(tx, ty);

  // draw the corners
  ctx.drawImage(img, ...part1, 0, 0, s, s); // top left
  ctx.drawImage(img, ...part3, width - s, 0, s, s); // top right
  ctx.drawImage(img, ...part7, 0, height - s, s, s); // bottom left
  ctx.drawImage(img, ...part9, width - s, height - s, s, s); // bottom right

  // draw the edges
  ctx.drawImage(img, ...part2, s, 0, width - 2 * s, s); // top
  ctx.drawImage(img, ...part8, s, height - s, width - 2 * s, s); // bottom
  ctx.drawImage(img, ...part4, 0, s, s, height - 2 * s); // left
  ctx.drawImage(img, ...part6, width - s, s, s, height - 2 * s); // right

  // draw the center
  ctx.drawImage(img, ...part5, s, s, width - 2 * s, height - 2 * s);

  ctx.restore();
};
