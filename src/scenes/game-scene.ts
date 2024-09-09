import { drawDottedGrid } from "../canvas-utils";
import { MouseEvent } from "../core/event";
import Container from "../display/container";
import { IGame } from "../game";
import { isMobile } from "../registry";
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
  sceneDimensions: GameSceneDimensions;
  private root: Container;
  // private elevators: [Elevator, Elevator];
  constructor(game: IGame) {
    document.querySelector<HTMLStyleElement>(".cc")!.style.imageRendering = "pixelated";
    super();

    const root = new Container();
    const model = new LiftModel({ numFloors: 8, startFromFloorNo: 9, unavailableFloorsIndices: [3, 4, 5] });
    const controller = new LiftController(model);
    model.setEventDispatcher(root);

    const { floors } = model;
    for (let i = 0; i < floors.length; i++) {
      // const floor = floors[i];
    }

    const sceneDimensions = getGameSceneDimensions(model.numFloors);
    const { canvasSize, sidebarSize, sceneWidth, sceneHeight} = sceneDimensions;
    game.resize(sceneWidth, sceneHeight);
    this.sceneDimensions = sceneDimensions;

    const gameArea = new GameArea(sceneDimensions, model, game.assets);

    const [frameCanvas] = game.assets["f"];
    const sidebar = new Sidebar(
      [
        isMobile ? canvasSize : sidebarSize,
        isMobile ? sidebarSize : canvasSize,
        +!isMobile * canvasSize,
        +isMobile * canvasSize,
      ],
      (floorIndex) => {
        controller.processButtonPress(floorIndex);
      },
      frameCanvas,
      floors,
    );
    root.children.push(gameArea, sidebar);

    this.root = root;
  }
  update(dt: number): void {
    this.root.update(dt);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { canvasSize, wallSize, gameAreaSize } = this.sceneDimensions;

    context.fillStyle = "red";
    context.fillRect(0, 0, canvasSize, canvasSize);

    this.root.draw(context);

    drawDottedGrid(context, wallSize, wallSize, gameAreaSize, gameAreaSize, 32);
  }
  onClick(mouseX: number, mouseY: number): void {
    this.root.dispatchEvent(new MouseEvent(mouseX, mouseY));
  }
}

// const { elevators, game, sceneDimensions } = this;
// const smallElevator = elevators[0];

// open doors animation
// game.tweener.tweenProperty(
//   30,
//   0,
//   32,
//   sine,
//   (v) => (smallElevator.doorWidth = v),
//   () => {
//     smallElevator.doorWidth = 32;
//   },
// );

// game.tweener.tweenProperty(
//   120,
//   smallElevator.position.y,
//   sceneDimensions.floorHeight * 0 + 16,
//   sine,
//   (v) => (smallElevator.position.y = v),
//   () => {
//     smallElevator.position.y = sceneDimensions.floorHeight * 0 + 16;
//   },
// );
