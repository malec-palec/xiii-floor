import { loadAssets } from "./assets";
import { Game } from "./game";
import "./styles.css";
import { setupRAF } from "./utils";

loadAssets(() => {
  const game = new Game();

  let now: number;
  let dt: number;
  let last = 0;
  let focused = true;

  onfocus = () => (focused = true);
  onblur = () => (focused = false);

  const loop = () => {
    if (!focused) return;

    now = performance.now();
    dt = now - last;
    last = now;

    game.update(dt);
  };
  setupRAF(loop);

  // no binding by design
  window.addEventListener("orientationchange", game.handleRotation);
  game.handleRotation();
});
