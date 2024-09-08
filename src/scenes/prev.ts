import {
  canvasPool,
  colorizeInPlace,
  drawSlices,
  eraseColorInPlace,
  getImageRegion,
  scalePixelated,
  wrapCanvasFunc,
} from "../canvas-utils";
import Container from "../display/container";
import { COLOR_BLACK, COLOR_WHITE, isMobile } from "../registry";
import Sprite from "../display/sprite";
import { logDebug } from "../utils";

const numFloors = 8;
const floorHeight = 16 * 4;
const wallSize = 16 * 0.5;
const gameAreaSize = numFloors * floorHeight;
const canvasSize = gameAreaSize + wallSize * 2;

const sidebarSize = 192;

export class NotAGame {
  private atlas: HTMLCanvasElement;
  private buttons: HTMLCanvasElement[] = [];
  private context: CanvasRenderingContext2D;

  private frame: HTMLCanvasElement;
  private pattern: CanvasPattern;
  private ppattern: CanvasPattern;

  private buttonArea: [number, number, number, number] = [64, 64, 64, 64];

  private root: Container;
  private char: Sprite;

  constructor(assets: HTMLImageElement[]) {
    const [atlas, butAtlas, frameImage, patternImage, ppatternImage] = assets;

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

    c.width = canvasSize + sidebarSize * +!isMobile;
    c.height = canvasSize + sidebarSize * +isMobile;
    logDebug("Canvas size:", c.width, c.height);

    this.context = c.getContext("2d")!;
    this.context.imageSmoothingEnabled = false;

    const frameCanvas = canvasPool.alloc();
    const frameContext = frameCanvas.getContext("2d")!;
    this.frame = scalePixelated(frameCanvas, frameContext, frameImage, 2);

    this.pattern = this.context.createPattern(patternImage, "repeat")!;
    this.ppattern = this.context.createPattern(ppatternImage, "repeat")!;

    this.root = new Container(100, 100);
    // this.char = new Sprite(this.atlas, 100, 100);
    // this.root.children.push(this.char);
  }
  update(dt: number): void {
    this.root.update(dt);
  }
  draw(): void {
    const { context, atlas, pattern, ppattern } = this;

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, 0, canvasSize, canvasSize);
    context.fillStyle = COLOR_WHITE;
    context.fillRect(wallSize, wallSize, gameAreaSize, gameAreaSize);

    context.fillStyle = COLOR_BLACK;
    context.fillRect(wallSize, floorHeight * 2, gameAreaSize, floorHeight);

    const smallElevatorSize = 16 * 4;
    const largeElevatorSize = 16 * 6;
    const borderWidth = 3;

    drawElevatorShaft(context, 256, smallElevatorSize, borderWidth, pattern);
    drawElevatorShaft(context, 256 + smallElevatorSize + borderWidth + 16 * 2, largeElevatorSize, borderWidth, pattern);

    context.fillStyle = COLOR_BLACK;
    context.fillRect(256 + smallElevatorSize / 2 - 1, wallSize, 2, wallSize + floorHeight * 3 + 16 * 1 - borderWidth);
    context.fillRect(256, wallSize + floorHeight * 3 + 16 * 1 - borderWidth, smallElevatorSize, 16 * 3 + borderWidth);

    context.fillStyle = COLOR_BLACK;
    context.fillRect(
      256 + smallElevatorSize + borderWidth + 16 * 2 + largeElevatorSize / 2 - 1,
      wallSize,
      2,
      wallSize + floorHeight * 5 + 16 * 1 - borderWidth,
    );
    context.fillRect(
      256 + smallElevatorSize + borderWidth + 16 * 2,
      wallSize + floorHeight * 5 + 16 * 1 - borderWidth,
      largeElevatorSize,
      16 * 3 + borderWidth,
    );
    context.fillStyle = COLOR_WHITE;
    context.fillRect(
      256 + smallElevatorSize + borderWidth + 16 * 2,
      wallSize + floorHeight * 5 + 16 * 1,
      largeElevatorSize,
      16 * 3,
    );

    context.fillStyle = COLOR_BLACK;
    for (let i = 1; i <= numFloors; i++) {
      context.fillRect(wallSize, floorHeight * i, gameAreaSize, wallSize);
    }

    this.buttonArea[0] = wallSize;
    this.buttonArea[1] = wallSize + floorHeight * 7;
    this.buttonArea[2] = 16 * 4;

    if (isMobile) {
      drawSlices(this.frame, this.context, 0, canvasSize, canvasSize, sidebarSize);
      // for (let i = 0; i < this.buttons.length; i++) {
      //   context.drawImage(this.buttons[i], 20 + Math.floor(i / 2) * 100, GAME_AREA_SIZE + 10 + (i % 2) * 100);
      // }
    } else {
      drawSlices(this.frame, this.context, canvasSize, 0, sidebarSize, canvasSize);
      // for (let i = 0; i < this.buttons.length; i++) {
      //   context.drawImage(this.buttons[i], GAME_AREA_SIZE + 10 + (i % 2) * 100, 20 + Math.floor(i / 2) * 100);
      // }
    }

    // context.save();
    // context.rect(100, 100, 300, 300);
    // context.clip();
    // context.fillStyle = "blue";
    // context.fillRect(200, 200, 400, 400);
    // context.restore();

    context.fillStyle = "#111111";
    for (let i = 0; i < 7; i++) {
      context.drawImage(atlas, 16 * 3 + (atlas.width - 0) * i, wallSize + floorHeight * 5 - atlas.height - wallSize);
    }

    // context.fillStyle = this.pattern;
    // context.fillRect(0, floorHeight * numFloors, gameAreaSize, gameAreaSize - floorHeight * numFloors);

    // context.fillStyle = "green";
    // context.fillRect(...this.buttonArea);

    // const [buttonX, buttonY, buttonWidth, buttonHeight] = this.buttonArea;
    // if (mx >= buttonX && mx <= buttonX + buttonWidth && my >= buttonY && my <= buttonY + buttonHeight) {
    //   logDebug("Button clicked!");
    // }

    this.root.draw(context);
  }
}

function drawElevatorShaft(
  context: CanvasRenderingContext2D,
  sx: number,
  elevatorSize: number,
  borderSize: number,
  pattern: CanvasPattern,
) {
  context.fillStyle = COLOR_BLACK;
  context.fillRect(sx - borderSize, wallSize, borderSize, gameAreaSize);
  context.fillRect(sx + elevatorSize, wallSize, borderSize, gameAreaSize);

  context.fillStyle = pattern;
  context.fillRect(sx, wallSize, elevatorSize, gameAreaSize);
}
