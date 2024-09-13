import { MouseEvent } from "../core/event";
import Container from "../display/container";
import { IGame } from "../game";
import { COLOR_BLACK, isMobile } from "../registry";
import { GameArea } from "./game/game-area";
import { LiftController, LiftModel } from "./game/lift";
import { Sidebar } from "./game/sidebar";
import { BaseScene } from "./scene";

export type GameSceneDimensions = {
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
  const sidebarSize = 16 * 9;
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
  private sceneDimensions!: GameSceneDimensions;
  private root!: Container;
  constructor(private game: IGame) {
    document.querySelector<HTMLStyleElement>(".cc")!.style.imageRendering = "pixelated";
    super();
    this.reset();
  }
  reset(): void {
    const { game } = this;
    const root = new Container();
    const model = new LiftModel({
      numFloors: 8,
      startFromFloorNo: 9,
      unavailableFloorsIndices: [3, 4, 5],
      elevators: [
        { maxCapacity: 3, floorIndex: 2, capacity: 0 },
        { maxCapacity: 5, floorIndex: 7 - 2, capacity: 0 },
      ],
      peoplePerFloor: {
        1: 7,
      },
    });
    const controller = new LiftController(model, root, game);

    const sceneDimensions = getGameSceneDimensions(model.numFloors);
    const { canvasSize, sidebarSize, sceneWidth, sceneHeight } = sceneDimensions;
    game.resize(sceneWidth, sceneHeight);

    const gameArea = new GameArea(sceneDimensions, model, controller, game.tweener, game.assets, game);
    const sidebar = new Sidebar(
      [
        isMobile ? canvasSize : sidebarSize,
        isMobile ? sidebarSize : canvasSize,
        +!isMobile * canvasSize,
        +isMobile * canvasSize,
      ],
      game.assets,
      model,
      controller,
      this.reset.bind(this),
    );
    root.children.push(gameArea, sidebar);

    this.root = root;
    this.sceneDimensions = sceneDimensions;
  }
  update(dt: number): void {
    this.root.update(dt);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { canvasSize } = this.sceneDimensions;

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, 0, canvasSize, canvasSize);

    this.root.draw(context);
  }
  onClick(mouseX: number, mouseY: number): void {
    this.root.dispatchEvent(new MouseEvent(mouseX, mouseY));
  }
}
