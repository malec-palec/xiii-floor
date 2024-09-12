import { logDebug } from "../../core/debug";
import { Event, IEventDispatcher } from "../../core/event";

export type FloorData = {
  no: number;
  isUnavailable: boolean;
  people: number;
};

export type ElevatorData = {
  capacity: number;
  maxCapacity: number;
  floorIndex: number;
};

export const enum LiftAction {
  changeFloor,
}

type LiftData = { action: LiftAction; isOverweight: boolean; isOut: boolean };

export class LiftEvent extends Event {
  constructor(public data: LiftData) {
    super();
  }
}

type LiftModelParams = {
  numFloors: number;
  startFromFloorNo: number;
  elevators: [ElevatorData, ElevatorData];
  peoplePerFloor: { [key: number]: number };
  unavailableFloorsIndices?: number[];
  maxSteps?: number;
};

export class LiftModel {
  steps = 0;
  isInputEnabled: boolean = true;
  readonly floors: FloorData[] = [];
  readonly elevators: [ElevatorData, ElevatorData];

  constructor({
    numFloors,
    startFromFloorNo,
    elevators,
    peoplePerFloor,
    unavailableFloorsIndices = [],
    maxSteps = 20,
  }: LiftModelParams) {
    for (let i = 0; i < numFloors; i++) {
      this.floors[i] = {
        no: startFromFloorNo++,
        isUnavailable: unavailableFloorsIndices.includes(i),
        people: peoplePerFloor[i] ?? 0,
      };
    }
    this.elevators = elevators;
    this.steps = maxSteps;
  }

  get numFloors(): number {
    return this.floors.length;
  }
}

export class LiftController {
  constructor(
    private model: LiftModel,
    private eventDispatcher: IEventDispatcher,
  ) {}
  processButtonPress(newFloorIndex: number, isOverweight = false): void {
    const { model, eventDispatcher } = this;
    const hasFloorChanged = newFloorIndex !== model.elevators[0].floorIndex;
    if (!hasFloorChanged) return;

    if (!isOverweight) model.steps--;

    if (model.steps === 0) {
      logDebug("You loose!");
    }

    model.elevators[0].floorIndex = newFloorIndex;
    model.elevators[1].floorIndex = model.numFloors - 1 - newFloorIndex;

    if (model.elevators[1].floorIndex < 0) {
      eventDispatcher.dispatchEvent(new LiftEvent({ action: LiftAction.changeFloor, isOverweight, isOut: true }));
      return;
    }

    if (
      model.floors[model.elevators[0].floorIndex].no === 13 ||
      model.floors[model.elevators[1].floorIndex].no === 13
    ) {
      logDebug("You win!");
    }

    const { elevators, floors } = model;
    for (let i = 0; i < elevators.length; i++) {
      const elevator = elevators[i];
      const floor = model.floors[elevator.floorIndex];
      if (!floor) continue;
      if (floor.people > 0) {
        const delta = Math.min(elevator.maxCapacity - elevator.capacity, floor.people);
        if (delta > 0) {
          floors[elevator.floorIndex].people -= delta;
          elevator.capacity += delta;
        }
      } else {
        floors[elevator.floorIndex].people += elevator.capacity;
        elevator.capacity = 0;
      }
    }
    eventDispatcher.dispatchEvent(new LiftEvent({ action: LiftAction.changeFloor, isOverweight, isOut: false }));
  }
  checkOverweight(): boolean {
    const {
      model: { elevators },
    } = this;
    if (elevators[1].capacity - elevators[0].capacity >= 5) {
      this.processButtonPress(elevators[0].floorIndex + 1, true);
      return true;
    }
    return false;
  }
  enableInput(value: boolean): void {
    this.model.isInputEnabled = value;
  }
}
