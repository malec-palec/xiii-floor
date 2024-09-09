export interface IEventDispatcher {
  dispatchEvent(event: Event): void;
}

export class Event {
  private _accepted = false;
  get isAccepted(): boolean {
    return this._accepted;
  }
  accept(): void {
    this._accepted = true;
  }
}

export class MouseEvent extends Event {
  constructor(
    public mouseX: number,
    public mouseY: number,
  ) {
    super();
  }
}
