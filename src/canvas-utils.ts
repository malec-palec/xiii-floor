import { ScaleX } from "./scalex";
import type { Tail } from "./types";
import { createObjectPool } from "./utils";

type BetterCanvasImageSource = Exclude<CanvasImageSource, VideoFrame>;

const canvasPool = createObjectPool(
  () => document.createElement("canvas"),
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

export const eraseColor = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: BetterCanvasImageSource,
  r = 0,
  g = r,
  b = r,
): HTMLCanvasElement => {
  canvas.width = <number>image.width;
  canvas.height = <number>image.height;
  context.drawImage(image, 0, 0);

  const imgData = context.getImageData(0, 0, canvas.width, canvas.height),
    rgba = imgData.data;

  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i] === r && rgba[i + 1] === g && rgba[i + 2] === b) {
      rgba[i + 3] = 0;
    }
  }
  context.putImageData(imgData, 0, 0);

  return canvas;
};

export const getOpaqueBounds = (
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
};

export const scalePixelated = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: BetterCanvasImageSource,
  scaleX: number,
  scaleY = scaleX,
): HTMLCanvasElement => {
  canvas.width = <number>image.width * scaleX;
  canvas.height = <number>image.height * scaleY;
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
};

export const drawRegion = (
  image: CanvasImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx = 0,
  dy = 0,
  canvas = canvasPool.alloc(),
  context = canvas.getContext("2d")!,
): HTMLCanvasElement => {
  canvas.width = sw;
  canvas.height = sh;
  context.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
  return canvas;
};

export const colorizeImage = (
  image: BetterCanvasImageSource,
  color: string,
  canvas = canvasPool.alloc(),
  context = canvas.getContext("2d")!,
): HTMLCanvasElement => {
  canvas.width = <number>image.width;
  canvas.height = <number>image.height;
  context.drawImage(image, 0, 0);

  context.fillStyle = color;
  context.globalCompositeOperation = "source-in";
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
};

export const upscale = (image: HTMLCanvasElement, scaleFactor: 2 | 3): HTMLCanvasElement => {
  const canvas = canvasPool.alloc();
  const context = canvas.getContext("2d")!;
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const scaleFunc = (scaleFactor === 2 ? ScaleX.scale2x : ScaleX.scale3x).bind(ScaleX);
  const scaledImageData = scaleFunc(imageData);
  canvas.width *= scaleFactor * 16;
  canvas.height *= scaleFactor * 16;
  // context.clearRect(0, 0, canvas.width, canvas.height);
  context.putImageData(scaledImageData, 0, 0);
  return canvas;
};
