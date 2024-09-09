import manifest from "./assets/a.json";
import ATLAS_URL from "./assets/a.png";
import { getImageRegion } from "./canvas-utils";
import { TILE_SIZE } from "./registry";

type AssetManifestKeys = keyof typeof manifest;
export type AssetMap = Record<AssetManifestKeys, HTMLCanvasElement>;

export interface IAssetsProvider {
  readonly assets: AssetMap;
}

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve /* , reject */) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    // image.onerror = reject;
  });

export const loadAssets = async (): Promise<AssetMap> => {
  const atlas = await loadImage(ATLAS_URL);

  const assets: { [key: string]: HTMLCanvasElement } = {};
  let key: AssetManifestKeys;
  for (key in manifest) {
    const [x, y, w = TILE_SIZE, h = TILE_SIZE] = manifest[key];
    const [canvas] = getImageRegion(atlas, x, y, w, h);
    assets[key] = canvas;
  }
  return assets as AssetMap;
};
