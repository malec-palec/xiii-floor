export const TILE_SIZE = 16;

export const GAME_AREA_SIZE = 600;
export const SIDEBAR_SIZE = 200;

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const getScreenSize = (): [number, number] => [
  isMobile ? GAME_AREA_SIZE : GAME_AREA_SIZE + SIDEBAR_SIZE,
  isMobile ? GAME_AREA_SIZE + SIDEBAR_SIZE : GAME_AREA_SIZE,
];
