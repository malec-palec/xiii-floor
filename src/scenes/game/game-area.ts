import { AssetMap } from "../../assets";
import { colorizeInPlace, eraseColorInPlace } from "../../canvas-utils";
import { Event } from "../../core/event";
import { Tweener } from "../../core/tweener";
import Container from "../../display/container";
import Sprite from "../../display/sprite";
import SpriteSheet from "../../display/sprite-sheet";
import { BIG_TILE_SIZE, COLOR_BLACK, COLOR_WHITE, TILE_SIZE } from "../../registry";
import { delay } from "../../utils";
import { GameSceneDimensions } from "../game-scene";
import { Elevator, ElevatorShaft } from "./elevator";
import { ElevatorData, LiftAction, LiftController, LiftEvent, LiftModel } from "./lift";

export class GameArea extends Container {
  private chars: Sprite[][] = [];
  private elevators: [Elevator, Elevator];
  constructor(
    private sceneDimensions: GameSceneDimensions,
    private model: LiftModel,
    private controller: LiftController,
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
    const smallElevatorModel = model.elevators[0];
    const smallElevator = new Elevator(
      [
        smallElevatorWidth,
        elevatorHeight,
        smallElevatorStartPosX,
        gameAreaSize - floorHeight * smallElevatorModel.floorIndex,
      ],
      tweener,
    );

    const largeElevatorStartPosX = bigTileSize * 11;
    const largeElevatorWidth = bigTileSize * 3;
    const largeShaft = new ElevatorShaft(fencePattern, largeElevatorWidth, gameAreaSize, largeElevatorStartPosX);
    const largeElevatorModel = model.elevators[1];
    const largeElevator = new Elevator(
      [
        largeElevatorWidth,
        elevatorHeight,
        largeElevatorStartPosX,
        gameAreaSize - floorHeight * largeElevatorModel.floorIndex,
      ],
      tweener,
    );
    this.elevators = [smallElevator, largeElevator];

    this.children.push(smallShaft, smallElevator, largeShaft, largeElevator);

    const [charCanvas, charContext] = assets["c"];
    eraseColorInPlace(charCanvas, charContext);
    colorizeInPlace(charCanvas, charContext, COLOR_BLACK);

    const { floors } = model;
    for (let i = 0; i < floors.length; i++) {
      const floor = floors[i];
      const floorChars: Sprite[] = [];
      if (floor.people > 0) {
        for (let j = 0; j < floor.people; j++) {
          const char = new Sprite(
            charCanvas,
            smallElevatorStartPosX - (j + 1) * BIG_TILE_SIZE,
            gameAreaSize - floorHeight * i,
          );
          char.scale.x = char.scale.y = 3;
          char.pivot.x = 0.5;
          char.pivot.y = 1;
          floorChars.push(char);
        }
        this.children.push(...floorChars);
      }
      this.chars[i] = floorChars;
    }

    const [numbersCanvas, numbersContext] = assets["n"];
    eraseColorInPlace(numbersCanvas, numbersContext);
    colorizeInPlace(numbersCanvas, numbersContext, COLOR_BLACK);

    // TODO: make counter widget
    const offset = 4;
    const scale = 4;
    for (let i = 0; i < model.numFloors; i++) {
      const numStr = String(model.floors[i].no);
      const first = numStr.length === 2 ? parseInt(numStr[0]) : 0;
      const second = numStr.length === 2 ? parseInt(numStr[1]) : parseInt(numStr[0]);

      const firstNum = new SpriteSheet(
        [3, 5, BIG_TILE_SIZE * 15, gameAreaSize - (i + 1) * floorHeight + wallSize + offset],
        numbersCanvas,
        first,
      );
      firstNum.scale.x = firstNum.scale.y = scale;
      const secondNum = new SpriteSheet(
        [3, 5, firstNum.position.x + firstNum.width * scale + offset, firstNum.position.y],
        numbersCanvas,
        second,
      );
      secondNum.scale.x = secondNum.scale.y = scale;
      this.children.push(firstNum, secondNum);
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

  async moveElevator(
    elevator: Elevator,
    elevatorModel: ElevatorData,
    numPeople: number,
    isOverweight: boolean,
  ): Promise<void> {
    const { sceneDimensions } = this;

    if (!isOverweight) await elevator.close();

    const endY = sceneDimensions.gameAreaSize - sceneDimensions.floorHeight * elevatorModel.floorIndex;
    await elevator.moveTo(endY, (Math.abs(endY - elevator.position.y) / sceneDimensions.floorHeight) * 20);

    if (!isOverweight) await elevator.open();

    // Temp
    if (isOverweight) await delay(200);

    const { floorIndex } = elevatorModel;
    const floorChars = this.chars[floorIndex];
    let delta = floorChars.length - numPeople;

    const { chars } = elevator;
    if (delta > 0) {
      // go in
      if (chars.length > 0) {
        for (let i = 0; i < chars.length; i++) {
          chars[i].position.x = elevator.getCharPlace(i, elevatorModel.capacity);
        }
      }
      while (delta > 0) {
        const char = floorChars.shift()!;
        char.position.x = elevator.getCharPlace(chars.length, elevatorModel.capacity);
        char.scale.x *= -1;
        chars.push(char);
        delta--;
      }
    } else {
      // go out
      while (delta < 0) {
        const char = chars.pop()!;
        char.position.x = this.elevators[0].position.x - (floorChars.length + 1) * BIG_TILE_SIZE;
        char.scale.x *= -1;
        floorChars.push(char);
        delta++;
      }
    }

    await delay(200);

    for (let i = 0; i < floorChars.length; i++) {
      const char = floorChars[i];
      char.position.x = this.elevators[0].position.x - (i + 1) * BIG_TILE_SIZE;
    }
  }

  protected async handleEvent(event: Event): Promise<void> {
    const { model, controller, elevators } = this;
    if (event instanceof LiftEvent) {
      const { data } = event;
      switch (data.action) {
        case LiftAction.changeFloor:
          controller.enableInput(false);
          await Promise.all(
            elevators.map((elevator, i) => {
              const elevatorModel = model.elevators[i];
              const { people } = model.floors[elevatorModel.floorIndex];
              return this.moveElevator(elevator, elevatorModel, people, data.isOverweight);
            }),
          );
          if (!controller.checkOverweight()) controller.enableInput(true);
          break;
      }
    }
  }
}
