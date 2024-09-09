import { AssetMap } from "../../assets";
import { colorizeInPlace, eraseColorInPlace } from "../../canvas-utils";
import { Event } from "../../core/event";
import { Tweener } from "../../core/tweener";
import Container from "../../display/container";
import Sprite from "../../display/sprite";
import { COLOR_BLACK, COLOR_WHITE, TILE_SIZE } from "../../registry";
import { GameSceneDimensions } from "../game-scene";
import { Elevator, ElevatorShaft } from "./elevator";
import { LiftAction, LiftEvent, LiftModel } from "./lift";

export class GameArea extends Container {
  private chars: Sprite[][] = [];
  private elevators: [Elevator, Elevator];
  constructor(
    private sceneDimensions: GameSceneDimensions,
    private model: LiftModel,
    tweener: Tweener,
    assets: AssetMap,
  ) {
    const { gameAreaSize, floorHeight, wallSize } = sceneDimensions;
    super(wallSize, wallSize);

    const [fencePatternCanvas] = assets["p"];

    const fencePattern = c.getContext("2d")!.createPattern(fencePatternCanvas, "repeat")!;

    const bigTileSize = TILE_SIZE * 2;
    const elevatorHeight = TILE_SIZE * 3 - wallSize;

    const smallElevatorStartPosX = bigTileSize * 8;
    const smallElevatorWidth = bigTileSize * 2;
    const smallShaft = new ElevatorShaft(fencePattern, smallElevatorWidth, gameAreaSize, smallElevatorStartPosX);
    const smallElevator = new Elevator(
      tweener,
      smallElevatorWidth,
      elevatorHeight,
      smallElevatorStartPosX,
      gameAreaSize - floorHeight * model.elevators[0].floorIndex,
    );

    const largeElevatorStartPosX = bigTileSize * 11;
    const largeElevatorWidth = bigTileSize * 3;
    const largeShaft = new ElevatorShaft(fencePattern, largeElevatorWidth, gameAreaSize, largeElevatorStartPosX);
    const largeElevator = new Elevator(
      tweener,
      largeElevatorWidth,
      elevatorHeight,
      largeElevatorStartPosX,
      gameAreaSize - floorHeight * model.elevators[1].floorIndex,
    );
    this.elevators = [smallElevator, largeElevator];

    this.children.push(smallShaft, smallElevator, largeShaft, largeElevator);

    const [charCanvas, charContext] = assets["c"];
    eraseColorInPlace(charCanvas, charContext);
    colorizeInPlace(charCanvas, charContext, "#111111");

    const { floors } = model;
    for (let i = 0; i < floors.length; i++) {
      const floor = floors[i];
      if (floor.people > 0) {
        const floorChars: Sprite[] = [];
        for (let j = 0; j < floor.people; j++) {
          const char = new Sprite(charCanvas, smallElevatorStartPosX - (j + 1) * 32, gameAreaSize - floorHeight * i);
          char.scale.x = char.scale.y = 3;
          char.pivot.x = 0.5;
          char.pivot.y = 1;
          floorChars.push(char);
        }
        this.children.push(...floorChars);
        this.chars[i] = floorChars;
      }
    }
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

  protected handleEvent(event: Event): void {
    const { sceneDimensions, model, elevators } = this;
    if (event instanceof LiftEvent) {
      switch (event.action) {
        case LiftAction.changeFloor:
          for (let i = 0; i < elevators.length; i++) {
            const elevator = elevators[i];
            const endY = sceneDimensions.gameAreaSize - sceneDimensions.floorHeight * model.elevators[i].floorIndex;
            elevator
              .close()
              .then(() => elevator.moveTo(endY, (Math.abs(endY - elevator.position.y) / sceneDimensions.floorHeight) * 20))
              .then(() => elevator.open());
            // enable controls
          }
          break;
      }
    }
  }
}
