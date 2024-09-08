import { Event, MouseEvent } from "../core/event";
import { DisplayObject } from "./display-object";

export class Button<T> extends DisplayObject {
  constructor(
    private data: T,
    private clickHandler: (data: T) => void,
    width: number,
    height: number,
    x = 0,
    y = 0,
  ) {
    super(width, height, x, y);
  }
  draw(context: CanvasRenderingContext2D): void {
    const { width, height, data } = this;
    context.fillStyle = "green";
    context.fillRect(0, 0, width, height);

    // document.querySelector<HTMLStyleElement>(".cc")!.style.imageRendering = "auto";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "white";
    context.font = "32px Arial";
    context.fillText(String(data), width / 2, height / 2);
    // document.querySelector<HTMLStyleElement>(".cc")!.style.imageRendering = "pixelated";
  }
  protected handleEvent(event: Event): void {
    if (event instanceof MouseEvent) {
      const { position, width, height, clickHandler, data } = this;
      if (
        event.mouseX >= position.x &&
        event.mouseX <= position.x + width &&
        event.mouseY >= position.y &&
        event.mouseY <= position.y + height
      ) {
        clickHandler(data);
        event.accept();
      }
    }
  }
}
