import {
  canvasPool,
  colorizeInPlace,
  drawSlices,
  eraseColorInPlace,
  getImageRegion,
  scalePixelated,
  wrapCanvasFunc,
} from "./canvas-utils";
import { GAME_AREA_SIZE, isMobile, SIDEBAR_SIZE } from "./registry";

const numFloors = 8;

export class Game {
  private atlas: HTMLCanvasElement;
  private buttons: HTMLCanvasElement[] = [];
  private context: CanvasRenderingContext2D;

  private frame: HTMLCanvasElement;
  private pattern: CanvasPattern;

  private buttonArea = [32, 32, 64, 64] as const;

  constructor(assets: HTMLImageElement[]) {
    const [atlas, butAtlas, frameImage, patternImage] = assets;

    const [atlasCanvas, atlasContext] = getImageRegion(atlas, 0, 0, 9, 9);
    eraseColorInPlace(atlasCanvas, atlasContext);
    colorizeInPlace(atlasCanvas, atlasContext, "#111111");
    this.atlas = wrapCanvasFunc(scalePixelated, atlasCanvas, 3);

    const BUTTON_TILE_SIZE = 16;
    const butRows = butAtlas.width / BUTTON_TILE_SIZE;
    const butCols = butAtlas.height / BUTTON_TILE_SIZE;
    let x: number, y: number, i: number;
    for (y = 0; y < butCols; y++) {
      for (x = 0; x < butRows; x++) {
        i = x + y * butRows;
        const [butCanvas] = getImageRegion(
          butAtlas,
          x * BUTTON_TILE_SIZE,
          y * BUTTON_TILE_SIZE,
          BUTTON_TILE_SIZE,
          BUTTON_TILE_SIZE,
        );
        this.buttons[i] = wrapCanvasFunc(scalePixelated, butCanvas, 5);
      }
    }

    this.context = c.getContext("2d")!;

    const frameCanvas = canvasPool.alloc();
    const frameContext = frameCanvas.getContext("2d")!;
    this.frame = scalePixelated(frameCanvas, frameContext, frameImage, 2);

    this.pattern = this.context.createPattern(patternImage, "repeat")!;
  }
  update(dt: number): void {}
  draw(): void {
    const { context, atlas } = this;
    context.fillStyle = "#EEEEEE";
    context.fillRect(0, 0, GAME_AREA_SIZE, GAME_AREA_SIZE);

    const floorHeight = 16 * 4;
    const wallSize = 16 * 0.5;

    context.fillStyle = "#111111";
    for (let i = 1; i <= numFloors; i++) {
      context.fillRect(0, floorHeight * i - wallSize, GAME_AREA_SIZE, wallSize);
    }

    if (isMobile) {
      drawSlices(this.frame, this.context, 0, GAME_AREA_SIZE, GAME_AREA_SIZE, SIDEBAR_SIZE);
      // for (let i = 0; i < this.buttons.length; i++) {
      //   context.drawImage(this.buttons[i], 20 + Math.floor(i / 2) * 100, GAME_AREA_SIZE + 10 + (i % 2) * 100);
      // }
    } else {
      drawSlices(this.frame, this.context, GAME_AREA_SIZE, 0, SIDEBAR_SIZE, GAME_AREA_SIZE);
      // for (let i = 0; i < this.buttons.length; i++) {
      //   context.drawImage(this.buttons[i], GAME_AREA_SIZE + 10 + (i % 2) * 100, 20 + Math.floor(i / 2) * 100);
      // }
    }

    const sx = 120;
    context.fillStyle = "red";
    context.fillRect(sx, 16 - wallSize, 32, 16 * 3);
    context.fillRect(sx + 32, 16 - wallSize, 32, 16 * 3);

    context.fillStyle = "#111111";
    for (let i = 0; i < 10; i++) {
      context.drawImage(atlas, 16 + (atlas.width - 12) * i, floorHeight - atlas.height - wallSize);
    }

    context.fillStyle = this.pattern;
    context.fillRect(0, floorHeight * numFloors, GAME_AREA_SIZE, GAME_AREA_SIZE - floorHeight * numFloors);

    context.fillStyle = "green";
    context.fillRect(...this.buttonArea);
  }
}
