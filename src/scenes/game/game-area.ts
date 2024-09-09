import { AssetMap } from "../../assets";
import { colorizeInPlace, eraseColorInPlace } from "../../canvas-utils";
import Container from "../../display/container";
import Sprite from "../../display/sprite";
import { COLOR_BLACK, COLOR_WHITE } from "../../registry";
import { GameSceneDimensions } from "../game-scene";
import { Elevator, ElevatorShaft } from "./elevator";
import { LiftModel } from "./lift";

export class GameArea extends Container {
  constructor(
    private sceneDimensions: GameSceneDimensions,
    private model: LiftModel,
    assets: AssetMap,
  ) {
    const { gameAreaSize, floorHeight, wallSize } = sceneDimensions;
    super(wallSize, wallSize);

    const [fencePatternCanvas] = assets["p"];

    const fencePattern = c.getContext("2d")!.createPattern(fencePatternCanvas, "repeat")!;
    const tileSize = 32;

    const elevatorHeight = (tileSize / 2) * 3 - wallSize;

    const smallElevatorStartPosX = tileSize * 8;
    const smallElevatorWidth = tileSize * 2;
    const smallShaft = new ElevatorShaft(fencePattern, smallElevatorWidth, gameAreaSize, smallElevatorStartPosX);
    const smallElevator = new Elevator(smallElevatorWidth, elevatorHeight, smallElevatorStartPosX, floorHeight * 1);

    const largeElevatorStartPosX = tileSize * 11;
    const largeElevatorWidth = tileSize * 3;
    const largeShaft = new ElevatorShaft(fencePattern, largeElevatorWidth, gameAreaSize, largeElevatorStartPosX);
    const largeElevator = new Elevator(largeElevatorWidth, elevatorHeight, largeElevatorStartPosX, floorHeight * 2);

    const [charCanvas, charContext] = assets["c"];
    eraseColorInPlace(charCanvas, charContext);
    colorizeInPlace(charCanvas, charContext, "#111111");

    const char = new Sprite(charCanvas, 32, 64);
    char.scale.x = char.scale.y = 3;
    char.pivot.x = 0.5;
    char.pivot.y = 1;
    // char.scale.x = -3;

    this.children.push(smallShaft, smallElevator, largeShaft, largeElevator, char);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { sceneDimensions, model } = this;
    const { gameAreaSize, floorHeight, wallSize } = sceneDimensions;
    context.fillStyle = COLOR_WHITE;
    context.fillRect(0, 0, gameAreaSize, gameAreaSize);

    super.draw(context);

    // draw floors
    context.fillStyle = COLOR_BLACK;
    for (let i = 0; i <= model.numFloors; i++) {
      context.fillRect(0, floorHeight * i, gameAreaSize, wallSize);
    }
  }
}
