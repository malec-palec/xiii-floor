import manifest from "./assets/a.json";
import ATLAS_URL from "./assets/a.png";
import { getImageRegion } from "./canvas-utils";
import { TILE_SIZE } from "./registry";

type AssetManifestKeys = keyof typeof manifest;
type AssetMap = Record<AssetManifestKeys, [HTMLCanvasElement, CanvasRenderingContext2D]>;

export const assets = {} as AssetMap;

export const loadAssets = (onAssetsLoaded: () => void): void => {
  const atlas = new Image();
  atlas.src = ATLAS_URL;
  atlas.onload = () => {
    let key: AssetManifestKeys;
    for (key in manifest) {
      const [x, y, w = TILE_SIZE, h = TILE_SIZE] = manifest[key];
      assets[key] = getImageRegion(atlas, x, y, w, h);
    }
    onAssetsLoaded();
  };
};
