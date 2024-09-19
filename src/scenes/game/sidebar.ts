import { assets } from "../../assets";
import { ButtonSensor } from "../../display/button-sensor";
import Container from "../../display/container";
import MovieClip from "../../display/movie-clip";
import { FrameShape } from "../../display/shape";
import Sprite from "../../display/sprite";
import SpriteSheet from "../../display/sprite-sheet";
import { isMobile, TILE_SIZE } from "../../registry";
import { delay } from "../../utils";
import { LiftController, LiftModel } from "./lift";

export class Sidebar extends Container {
  width: number;
  height: number;

  stepsFirstNum: SpriteSheet;
  stepsSecondNum: SpriteSheet;

  constructor(
    [width, height, x = 0, y = 0]: [number, number, number, number],
    private model: LiftModel,
    controller: LiftController,
    resetGame: () => void,
  ) {
    super(x, y);
    this.width = width;
    this.height = height;

    const { floors } = model;

    const [frameCanvas] = assets["f"];
    const frame = new FrameShape(frameCanvas, width, height);

    const butScaleFactor = 3;

    const [butCanvas] = assets["b"];
    const [numBigCanvas] = assets["nb"];
    const [stepsCanvas] = assets["s"];
    const [rCanvas] = assets["r"];

    const sensors: ButtonSensor<number>[] = [];
    const buts: MovieClip[] = [];
    const nums: SpriteSheet[] = [];
    const numFloors = floors.length;
    for (let i = 0; i < numFloors; i++) {
      const floor = floors[i];
      if (floor.no === 13) continue;

      const tx = !isMobile ? i % 2 : ~~(i / 2);
      const ty = !isMobile ? numFloors / 2 - 1 - ~~(i / 2) : i % 2;

      const sx = TILE_SIZE * (!isMobile ? 1 : 5) + tx * (TILE_SIZE * 4);
      const sy = TILE_SIZE * (!isMobile ? 5 : 1) + ty * (TILE_SIZE * 4);

      const but = new MovieClip([15, 14, sx, sy], butCanvas);
      but.scale.x = but.scale.y = butScaleFactor;
      buts.push(but);

      const numAlpha = floor.isUnavailable ? 0.4 : 1;
      const numStr = String(floor.no);
      const first = numStr.length === 2 ? parseInt(numStr[0]) : 0;
      const second = numStr.length === 2 ? parseInt(numStr[1]) : parseInt(numStr[0]);

      const firstNum = new SpriteSheet([5, 7, sx + 2 * butScaleFactor, sy + 2 * butScaleFactor], numBigCanvas, first);
      firstNum.scale.x = firstNum.scale.y = butScaleFactor;

      const secondNum = new SpriteSheet([5, 7, sx + 8 * butScaleFactor, sy + 2 * butScaleFactor], numBigCanvas, second);
      secondNum.scale.x = secondNum.scale.y = butScaleFactor;
      firstNum.alpha = secondNum.alpha = numAlpha;

      nums.push(firstNum, secondNum);

      const sensor = new ButtonSensor(
        [15 * butScaleFactor, 14 * butScaleFactor, sx, sy],
        i,
        !floor.isUnavailable,
        (floorIndex) => {
          if (model.isInputEnabled) {
            but.index = 1;
            firstNum.position.y += butScaleFactor;
            secondNum.position.y += butScaleFactor;
            delay(100).then(() => {
              but.index = 0;
              firstNum.position.y -= butScaleFactor;
              secondNum.position.y -= butScaleFactor;
            });
            controller.processButtonPress(floorIndex);
          }
        },
      );
      sensors.push(sensor);
    }

    const resetSensor = new ButtonSensor(
      [
        15 * butScaleFactor,
        14 * butScaleFactor,
        !isMobile ? TILE_SIZE : TILE_SIZE * 22,
        !isMobile ? TILE_SIZE * 21 : TILE_SIZE * 5,
      ],
      "R",
      true,
      resetGame,
    );
    const resetBut = new MovieClip([15, 14, resetSensor.position.x, resetSensor.position.y], butCanvas);
    resetBut.scale.x = resetBut.scale.y = butScaleFactor;
    const rLetter = new Sprite(
      rCanvas,
      resetBut.position.x + 5 * butScaleFactor,
      resetBut.position.y + 2 * butScaleFactor,
    );
    rLetter.scale.x = rLetter.scale.y = butScaleFactor;

    const steps = new Sprite(stepsCanvas, !isMobile ? TILE_SIZE / 2 : TILE_SIZE * 22, TILE_SIZE * 2);
    steps.scale.x = steps.scale.y = butScaleFactor;

    const stepsFirstNum = new SpriteSheet(
      [5, 7, steps.position.x + steps.width * butScaleFactor + 2 * butScaleFactor, steps.position.y],
      numBigCanvas,
      0,
    );
    stepsFirstNum.scale.x = stepsFirstNum.scale.y = butScaleFactor;

    const stepsSecondNum = new SpriteSheet(
      [
        5,
        7,
        stepsFirstNum.position.x + stepsFirstNum.width * butScaleFactor + 1 * butScaleFactor,
        stepsFirstNum.position.y,
      ],
      numBigCanvas,
      0,
    );
    stepsSecondNum.scale.x = stepsSecondNum.scale.y = butScaleFactor;

    this.stepsFirstNum = stepsFirstNum;
    this.stepsSecondNum = stepsSecondNum;

    this.children.push(
      frame,
      ...sensors,
      ...buts,
      ...nums,
      steps,
      stepsFirstNum,
      stepsSecondNum,
      resetSensor,
      resetBut,
      rLetter,
    );
  }
  draw(context: CanvasRenderingContext2D): void {
    context.clearRect(0,0,this.width,this.height);

    super.draw(context);
    if (!this.model.isInputEnabled) {
      context.fillStyle = "rgba(0,0,0,0.3)";
      context.fillRect(
        !isMobile ? TILE_SIZE : TILE_SIZE * 5,
        !isMobile ? TILE_SIZE * 5 : TILE_SIZE,
        !isMobile ? this.width - TILE_SIZE * 2 : TILE_SIZE * 15,
        !isMobile ? TILE_SIZE * 15 : this.width - TILE_SIZE * 2,
      );
    }

    const numStr = String(this.model.steps);
    const first = numStr.length === 2 ? parseInt(numStr[0]) : 0;
    const second = numStr.length === 2 ? parseInt(numStr[1]) : parseInt(numStr[0]);

    this.stepsFirstNum.index = first;
    this.stepsSecondNum.index = second;
  }
}
