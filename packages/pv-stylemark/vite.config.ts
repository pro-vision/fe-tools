import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    emptyOutDir: false,
    rollupOptions: {
      cache: false,
      input: {
        app: resolve("ui/index.ts"),
        styles: resolve("ui/styles/index.scss"),
      },
      output: {
        dir: "lib",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "styles.css") {
            return "css/[name].css";
          }
          return "resources/[name][extname]";
        },
        entryFileNames: "js/[name].js",
      },
    },
  },
});
