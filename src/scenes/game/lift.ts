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

type LiftModelParams = { numFloors: number; startFromFloorNo: number; unavailableFloorsIndices?: number[] };

export const enum LiftAction {
  changeFloor,
}

export class LiftEvent extends Event {
  constructor(public action: LiftAction) {
    super();
  }
}

export class LiftModel {
  steps = 0;
  readonly floors: FloorData[] = [];
  readonly elevators: ElevatorData[] = [
    { maxCapacity: 3, floorIndex: 2, capacity: 0 },
    { maxCapacity: 5, floorIndex: 7 - 2, capacity: 0 },
  ];
  isInputEnabled: boolean = true;

  constructor({ numFloors, startFromFloorNo, unavailableFloorsIndices = [] }: LiftModelParams) {
    for (let i = 0; i < numFloors; i++) {
      this.floors[i] = { no: startFromFloorNo++, isUnavailable: unavailableFloorsIndices.includes(i), people: 0 };
    }
    this.floors[1].people = 7;
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
  processButtonPress(newFloorIndex: number): void {
    const { model, eventDispatcher } = this;
    const hasFloorChanged = newFloorIndex !== model.elevators[0].floorIndex;
    if (!hasFloorChanged) return;

    model.steps++;
    model.elevators[0].floorIndex = newFloorIndex;
    model.elevators[1].floorIndex = model.numFloors - 1 - newFloorIndex;

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
      // if (model.elevators[1].capacity - model.elevators[0].capacity >= 5) {
      //   model.elevators[1].floorIndex -= 1;
      //   model.elevators[0].floorIndex += 1;
      //   model.isOverweight = true;
      // } else {
      //   model.isOverweight = false;
      // }
    }

    eventDispatcher.dispatchEvent(new LiftEvent(LiftAction.changeFloor));
  }
  enableInput(value: boolean): void {
    this.model.isInputEnabled = value;
  }
}
