import { IEventDispatcher } from "../../core/event";

export type FloorData = {
  no: number;
  isUnavailable: boolean;
  people: number;
};

type LiftModelParams = { numFloors: number; startFromFloorNo: number; unavailableFloorsIndices?: number[] };

export class LiftModel {
  floors: FloorData[] = [];

  private eventDispatcher?: IEventDispatcher;

  constructor({ numFloors, startFromFloorNo, unavailableFloorsIndices = [] }: LiftModelParams) {
    for (let i = 0; i < numFloors; i++) {
      this.floors[i] = { no: startFromFloorNo++, isUnavailable: unavailableFloorsIndices.includes(i), people: 0 };
    }
    this.floors[1].people = 7;
  }

  setEventDispatcher(eventDispatcher: IEventDispatcher): void {
    this.eventDispatcher = eventDispatcher;
  }

  get numFloors(): number {
    return this.floors.length;
  }
}

export class LiftController {
  constructor(private model: LiftModel) {}
}
