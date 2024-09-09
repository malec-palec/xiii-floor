import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [],
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
