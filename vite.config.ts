import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./",
  plugins: [viteSingleFile({ removeViteModuleLoader: true })],
  build: {
    assetsInlineLimit: 0,
  },
  preview: {
    open: true,
  },
  esbuild: {
    legalComments: "external",
  },
});
