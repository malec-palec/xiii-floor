import ATLAS_URL from "./assets/a.png";
import { Game } from "./game";
import { loadImage } from "./utils";

const onOrientationChanged = () => {
  const angle = screen.orientation.angle;
  if (angle === 0 || angle === 180) {
    // Portrait mode
    c.style.transform = "rotate(0deg)";
    c.style.width = "100vw";
  } else if (angle === 90 || angle === -90) {
    // Landscape mode
    c.style.transform = "rotate(-90deg)";
    c.style.width = "auto";
  }
};
window.addEventListener("orientationchange", onOrientationChanged);
onOrientationChanged();

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
