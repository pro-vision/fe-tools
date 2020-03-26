import { resolve } from "path";

import { appPath } from "../../../helpers/paths";

export const resolveSettings = {
  resolve: {
    // Add `.ts` as a resolvable extension.
    extensions: [".ts", ".mjs", ".js", ".jsx", ".tsx"],
    alias: {
      SRC: resolve(appPath, "src/"),
      JS: resolve(appPath, "src/js/"),
      Styles: resolve(appPath, "src/styles/"),
      Components: resolve(appPath, "src/components/")
    }
  }
};
