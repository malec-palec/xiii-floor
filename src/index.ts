import ATLAS_URL from "./assets/a.png";
import BUTTON_URL from "./assets/b.png";
import FRAME_URL from "./assets/f.png";
import PATTERN_URL from "./assets/p.png";
import { Game } from "./game";
import { getScreenSize } from "./registry";
import { loadImage } from "./utils";

const [w, h] = getScreenSize();
c.width = w;
c.height = h;

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
  const assets = await Promise.all([ATLAS_URL, BUTTON_URL, FRAME_URL, PATTERN_URL].map(loadImage));

  let now: number;
  let dt: number;
  let last = 0;
  let focused = true;

  onfocus = () => (focused = true);
  onblur = () => (focused = false);

  const game = new Game(assets);
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
