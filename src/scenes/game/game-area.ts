import { AssetMap } from "../../assets";
import { colorizeInPlace, eraseColorInPlace } from "../../canvas-utils";
import { logDebug } from "../../core/debug";
import { linear } from "../../core/easing";
import { Event } from "../../core/event";
import { Tweener } from "../../core/tweener";
import Container from "../../display/container";
import MovieClip from "../../display/movie-clip";
import SpriteSheet from "../../display/sprite-sheet";
import { BIG_TILE_SIZE, COLOR_BLACK, getColor, TILE_SIZE } from "../../registry";
import { delay } from "../../utils";
import { GameSceneDimensions } from "../game-scene";
import { Elevator, ElevatorShaft } from "./elevator";
import { ElevatorData, LiftAction, LiftController, LiftEvent, LiftModel } from "./lift";

export class GameArea extends Container {
  private chars: MovieClip[][] = [];
  private elevators: [Elevator, Elevator];
  private xiiFloorIndex = -1;
  constructor(
    private sceneDimensions: GameSceneDimensions,
    private model: LiftModel,
    private controller: LiftController,
    private tweener: Tweener,
    assets: AssetMap,
  ) {
    const { gameAreaSize, floorHeight, wallSize } = sceneDimensions;
    super(wallSize, wallSize);

    const [fencePatternCanvas, fencePatternContext] = assets["p"];
    eraseColorInPlace(fencePatternCanvas, fencePatternContext);
    colorizeInPlace(fencePatternCanvas, fencePatternContext, getColor(0.7));

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

    const [charAnimCanvas, charAnimContext] = assets["ca"];
    eraseColorInPlace(charAnimCanvas, charAnimContext);
    colorizeInPlace(charAnimCanvas, charAnimContext, COLOR_BLACK);

    const [charAnimAltCanvas, charAnimAltContext] = assets["cb"];
    eraseColorInPlace(charAnimAltCanvas, charAnimAltContext);
    colorizeInPlace(charAnimAltCanvas, charAnimAltContext, COLOR_BLACK);

    const { floors } = model;
    for (let i = 0; i < floors.length; i++) {
      const floor = floors[i];
      const floorChars: MovieClip[] = [];
      if (floor.people > 0) {
        for (let j = 0; j < floor.people; j++) {
          const charAnim = new MovieClip(
            [9, 9, smallElevatorStartPosX - (j + 1) * BIG_TILE_SIZE, gameAreaSize - floorHeight * i],
            Math.random() < 0.2 ? charAnimAltCanvas : charAnimCanvas,
          );
          charAnim.frames = [0, 1, 0, 2];
          charAnim.scale.x = charAnim.scale.y = 3;
          charAnim.pivot.x = 0.5;
          charAnim.pivot.y = 1;
          floorChars.push(charAnim);
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
      
      if (numStr === "13") this.xiiFloorIndex = i;
    }
  }
  draw(context: CanvasRenderingContext2D): void {
    const { sceneDimensions, model, xiiFloorIndex } = this;
    const { gameAreaSize, floorHeight, wallSize } = sceneDimensions;
    context.fillStyle = getColor(0.5);
    context.fillRect(0, 0, gameAreaSize, gameAreaSize);

    context.fillStyle = COLOR_BLACK;
    context.fillRect(0, floorHeight * xiiFloorIndex, gameAreaSize, -floorHeight);

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
    isOut: boolean
  ): Promise<void> {
    const { sceneDimensions, elevators, model } = this;

    if (!isOverweight) await elevator.close();

    const endY = sceneDimensions.gameAreaSize - sceneDimensions.floorHeight * elevatorModel.floorIndex;
    await elevator.moveTo(endY, (Math.abs(endY - elevator.position.y) / sceneDimensions.floorHeight) * 15);

    if (isOut) {
      logDebug("You loose!");
      return;
    }

    if (!isOverweight) await elevator.open();

    const { floorIndex } = elevatorModel;
    const floorChars = this.chars[floorIndex];
    let delta = floorChars.length - numPeople;

    const { chars } = elevator;
    const animations: Promise<void>[] = [];
    if (delta > 0) {
      // go in
      if (chars.length > 0) {
        for (let i = 0; i < chars.length; i++) {
          chars[i].position.x = elevator.getCharPlace(i, elevatorModel.capacity);
        }
      }
      while (delta > 0) {
        const char = floorChars.shift()!;
        animations.push(
          this.moveChar(char, elevator.getCharPlace(chars.length, elevatorModel.capacity), chars.length * 100).then(
            () => {
              char.scale.x *= -1;
            },
          ),
        );
        chars.push(char);
        delta--;
      }
    } else {
      // go out
      while (delta < 0) {
        const char = chars.pop()!;
        animations.push(
          this.moveChar(
            char,
            elevators[0].position.x - (model.floors[floorIndex].people - floorChars.length) * BIG_TILE_SIZE,
            floorChars.length * 100,
          ).then(() => {
            char.scale.x *= -1;
          }),
        );
        floorChars.unshift(char);
        delta++;
      }
    }
    if (animations.length > 0) await Promise.all(animations);

    await Promise.all(
      floorChars.map((char, i) => this.moveChar(char, elevators[0].position.x - (i + 1) * BIG_TILE_SIZE, i * 100)),
    );
  }

  private async moveChar(char: MovieClip, posX: number, waitForMs = 0): Promise<void> {
    if (waitForMs > 0) await delay(waitForMs);
    return new Promise((resolve) => {
      char.isPlaying = true;
      const { tweener } = this;
      const dist = Math.abs(posX - char.position.x);
      tweener.tweenProperty(
        (dist / char.width) * 2,
        char.position.x,
        posX,
        linear,
        (px) => (char.position.x = px),
        () => {
          char.stop();
          char.position.x = posX;
          resolve();
        },
      );
    });
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
              const people = model.floors[elevatorModel.floorIndex]?.people ?? -1;
              return this.moveElevator(elevator, elevatorModel, people, data.isOverweight, data.isOut);
            }),
          );
          if (!controller.checkOverweight()) controller.enableInput(true);
          break;
      }
    }
  }
}
