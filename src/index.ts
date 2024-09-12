import { loadAssets } from "./assets";
import { Game } from "./game";
import { logDebug } from "./utils";

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
    requestAnimationFrame(loop);

    if (!focused) return;

    now = performance.now();
    dt = now - last;
    last = now;

    game.update(dt);
  };
  loop();

  // setupRAF(loop);

  // no binding by design
  window.addEventListener("orientationchange", game.handleRotation);
  game.handleRotation();
};

main();

onerror = (event) => {
  console.log("[onerror] ::", event);
  return false;
};

onunhandledrejection = (event) => {
  logDebug("[onunhandledrejection] ::", event.reason.message);
  return false;
};
