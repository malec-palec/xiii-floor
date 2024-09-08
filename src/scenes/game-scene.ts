import { IGame } from "../game";
import { COLOR_WHITE, isMobile } from "../registry";
import { logDebug } from "../utils";
import { BaseScene } from "./scene";

type GameSceneDimensions = {
  floorHeight: number;
  wallSize: number;
  gameAreaSize: number;
  canvasSize: number;
  sidebarSize: number;
  sceneWidth: number;
  sceneHeight: number;
};

export const getGameSceneDimensions = (numFloors: number): GameSceneDimensions => {
  const floorHeight = 16 * 4;
  const wallSize = 16 / 2;
  const gameAreaSize = numFloors * floorHeight;
  const canvasSize = gameAreaSize + wallSize * 2;
  const sidebarSize = 192;
  return {
    floorHeight,
    wallSize,
    gameAreaSize,
    canvasSize,
    sidebarSize,
    sceneWidth: canvasSize + sidebarSize * +!isMobile,
    sceneHeight: canvasSize + sidebarSize * +isMobile,
  };
};

export class GameScene extends BaseScene {
  sceneDimensions: GameSceneDimensions;
  constructor(game: IGame) {
    super();
    const sceneDimensions = getGameSceneDimensions(8);
    game.resize(sceneDimensions.sceneWidth, sceneDimensions.sceneHeight);
    this.sceneDimensions = sceneDimensions;
  }
  // update(dt: number): void {}
  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = COLOR_WHITE;
    context.fillRect(0, 0, c.width, c.height);
  }
  onClick(mouseX: number, mouseY: number): void {
    logDebug("You are here!");
  }
}
