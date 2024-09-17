import "./styles.css";
import { loadAssets } from "./assets";
import { Game } from "./game";
import { setupRAF } from "./utils";

const main = async () => {
  const assets = await loadAssets();
  const game = new Game(assets);

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
};

main();
