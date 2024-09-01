import { Game } from "./game";
import ATLAS_URL from "./assets/a.png";
import { loadImage } from "./utils";

const main = async () => {
  const atlas = await loadImage(ATLAS_URL);

  let now: number;
  let dt: number;
  let last = 0;
  let focused = true;

  onfocus = () => (focused = true);
  onblur = () => (focused = false);

  const game = new Game(atlas);
  const loop = (t: number) => {
    requestAnimationFrame(loop);

    if (!focused) return;

    now = performance.now();
    dt = now - last;
    last = now;

    game.update(dt);
    game.draw();
  };
  loop(0);
};

main();
