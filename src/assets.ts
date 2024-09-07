export interface IAssetsProvider {
  readonly assets: HTMLImageElement[];
}

const imageUrls: Record<string, { default: string }> = import.meta.glob("./assets/*.png", { eager: true });

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });

// export const enum AssetIndex {
//   Atlas,
//   Buttons,
//   Frame,
//   Pattern,
//   Pattern2,
// }

export const loadAssets = (): Promise<HTMLImageElement[]> => {
  return Promise.all(Object.values(imageUrls).map((module) => loadImage(module.default)));
};

