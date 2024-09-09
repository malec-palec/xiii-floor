import { texturePacker } from "@assetpack/core/texture-packer";

export default {
  entry: "./raw-assets",
  output: "./src/assets",
  cache: false,
  pipes: [
    texturePacker({
      texturePacker: {
        padding: 0,
        nameStyle: "short",
        allowRotation: false,
        removeFileExtension: true,
        allowTrim: false
      },
    }),
  ],
};
