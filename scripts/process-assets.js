import fs from "node:fs/promises";
import sharp from "sharp";

const TILE_SIZE = 16;

const processAtlasManifest = async (atlasPath, outPath = atlasPath) => {
  const raw = await fs.readFile(atlasPath, "utf-8");
  const { frames } = JSON.parse(raw);
  const res = {};
  for (const frameName in frames) {
    const { frame } = frames[frameName];
    if (frame.w === TILE_SIZE) delete frame.w;
    if (frame.h === TILE_SIZE) delete frame.h;
    res[frameName] = Object.values(frame);
  }
  await fs.writeFile(outPath, JSON.stringify(res));
};

const processAtlasImage = async (atlasPath, atlasTempPath) => {
  await fs.rename(atlasPath, atlasTempPath);
  await sharp(atlasTempPath).removeAlpha().png({ palette: true, colors: 2, compressionLevel: 9 }).toFile(atlasPath);
  await fs.rm(atlasTempPath);
};

const run = async (atlasName) => {
  await Promise.all([
    processAtlasManifest(`./src/assets/${atlasName}.json`),
    processAtlasImage(`./src/assets/${atlasName}.png`, `./src/assets/${atlasName}_.png`),
  ]);
};
run("a");
