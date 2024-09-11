import { createPoint } from "./display-object";
import SpriteSheet from "./sprite-sheet";

export default class MovieClip extends SpriteSheet {
  isPlaying = false;
  frames: number[] = [];
  speedDivisor = 10;
  pivot = createPoint();
  private counter = 0;
  private frameNum = 0;
  constructor([width, height, x = 0, y = 0]: [number, number, number?, number?], atlas: DrawImageSource) {
    super([width, height, x, y], atlas);
    for (let i = 0; i < this.images.length; i++) {
      this.frames[i] = i;
    }
  }
  update(dt: number): void {
    const { frames, isPlaying, speedDivisor } = this;
    if (!isPlaying) return;
    this.counter = (this.counter + 1) % 1000;
    if (this.counter % speedDivisor === 0) this.frameNum = (this.frameNum + 1) % frames.length;
    this.index = frames[this.frameNum];
  }
  draw(context: CanvasRenderingContext2D): void {
    if (!this.isVisible) return;
    const { images, index, pivot, width, height } = this;
    context.drawImage(images[index], 0, 0, width, height, -width * pivot.x, -height * pivot.y, width, height);
  }
  stop():void {
    this.isPlaying = false;
    this.index = 0;
  }
}
