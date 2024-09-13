import { getImageRegion } from "../canvas-utils";
import { DisplayObject } from "./display-object";

export default class SpriteSheet extends DisplayObject {
  protected images: HTMLCanvasElement[] = [];
  alpha = 1;
  constructor(
    [width, height, x = 0, y = 0]: [number, number, number?, number?],
    atlas: DrawImageSource,
    public index = 0,
  ) {
    super(width, height, x, y);

    const atlasRows = atlas.width / width;
    const atlasCols = atlas.height / height;
    for (let y = 0; y < atlasCols; y++) {
      for (let x = 0; x < atlasRows; x++) {
        const i = x + y * atlasRows;
        const [imgCanvas] = getImageRegion(atlas, x * width, y * height, width, height);
        this.images[i] = imgCanvas;
      }
    }
  }
  draw(context: CanvasRenderingContext2D): void {
    const { images, index, alpha } = this;
    context.globalAlpha = alpha;
    context.drawImage(images[index], 0, 0);
    context.globalAlpha = 1;
  }
}
