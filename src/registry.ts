export const TILE_SIZE = 16;
export const BIG_TILE_SIZE = TILE_SIZE * 2;

const colors = ["#EEEEEE", "#F2F2F2", "#CCCCCC", "#A5A5A5", "#7F7F7F", "#595959", "#111111"];

export const getColor = (ratio: number): string => {
  const index = Math.round(ratio * (colors.length - 1));
  return colors[index];
};
export const COLOR_WHITE = getColor(0);
export const COLOR_BLACK = getColor(1);

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
