import { advzipPlugin, defaultAdvzipOptions, defaultEctOptions, ectPlugin } from "js13k-vite-plugins";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./",
  plugins: [
    viteSingleFile({ useRecommendedBuildConfig: false, removeViteModuleLoader: true }),
    createHtmlPlugin({ minify: true }),
    ectPlugin(defaultEctOptions),
    advzipPlugin(defaultAdvzipOptions),
    {
      name: "final-transformations",
      enforce: "post",
      renderChunk: async (code: string) => {
        return {
          // @ts-expect-error trust me - it's ES2021
          code: code.replaceAll("const ", "let "),
          map: null,
        };
      },
    },
  ],
  build: {
    assetsDir: ".",
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: "[name].[ext]", // Keep original asset names
      },
    },
  },
});
