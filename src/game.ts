import { colorizeImage, drawRegion, eraseColor, scalePixelated, wrapCanvasFunc } from "./canvas-utils";
import { GAME_AREA_SIZE, isMobile, SIDEBAR_SIZE } from "./registry";

const numFloors = 8;

export class Game {
  private atlas: HTMLCanvasElement;
  private buttons: HTMLCanvasElement[] = [];
  private context: CanvasRenderingContext2D;

  constructor(assets: HTMLImageElement[]) {
    const [atlas, butAtlas] = assets;
    let atlasCanvas = drawRegion(atlas, 0, 0, 9, 9);
    atlasCanvas = wrapCanvasFunc(eraseColor, atlasCanvas);
    atlasCanvas = wrapCanvasFunc(scalePixelated, atlasCanvas, 4);
    atlasCanvas = colorizeImage(atlasCanvas, "black");

    const BUTTON_TILE_SIZE = 16;
    const butRows = butAtlas.width / BUTTON_TILE_SIZE;
    const butCols = butAtlas.height / BUTTON_TILE_SIZE;
    let x: number, y: number, i: number;
    for (y = 0; y < butCols; y++) {
      for (x = 0; x < butRows; x++) {
        i = x + y * butRows;
        let butCanvas = drawRegion(
          butAtlas,
          x * BUTTON_TILE_SIZE,
          y * BUTTON_TILE_SIZE,
          BUTTON_TILE_SIZE,
          BUTTON_TILE_SIZE,
        );
        butCanvas = wrapCanvasFunc(scalePixelated, butCanvas, 5);
        // butCanvas = upscale(butCanvas, 2);
        this.buttons[i] = butCanvas;
      }
    }

    this.atlas = atlasCanvas;
    this.context = c.getContext("2d")!;
  }
  update(dt: number): void {}
  draw(): void {
    const { context } = this;
    context.fillStyle = "silver";
    context.fillRect(0, 0, GAME_AREA_SIZE, GAME_AREA_SIZE);

    const floorHeight = GAME_AREA_SIZE / numFloors;
    const wallHeight = 10;

    context.fillStyle = "black";
    for (let i = 0; i < numFloors; i++) {
      context.fillRect(0, GAME_AREA_SIZE - floorHeight * i - wallHeight, GAME_AREA_SIZE, wallHeight);
    }

    context.fillStyle = "0";
    if (isMobile) {
      context.fillRect(0, GAME_AREA_SIZE, GAME_AREA_SIZE, SIDEBAR_SIZE);
      for (let i = 0; i < this.buttons.length; i++) {
        context.drawImage(this.buttons[i], 20 + Math.floor(i / 2) * 100, GAME_AREA_SIZE + 10 + (i % 2) * 100);
      }
    } else {
      context.fillRect(GAME_AREA_SIZE, 0, SIDEBAR_SIZE, GAME_AREA_SIZE);
      for (let i = 0; i < this.buttons.length; i++) {
        context.drawImage(this.buttons[i], GAME_AREA_SIZE + 10 + (i % 2) * 100, 20 + Math.floor(i / 2) * 100);
      }
    }

    for (let i = 0; i < 10; i++) {
      context.drawImage(this.atlas, 5 + 4 * 9 * i, floorHeight - 4 * 9 - wallHeight);
    }
  }
}
