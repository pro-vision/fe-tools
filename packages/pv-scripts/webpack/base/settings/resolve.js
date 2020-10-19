const { resolve } = require("path");

const { appPath } = require("../../../helpers/paths");

module.exports = {
  resolve: {
    // Add `.ts` as a resolvable extension.
    extensions: [".ts", ".mjs", ".js", ".jsx", ".tsx"],
    alias: {
      SRC: resolve(appPath, "src/"),
      JS: resolve(appPath, "src/js/"),
      Styles: resolve(appPath, "src/styles/"),
      Components: resolve(appPath, "src/components/"),
    },
  },
};
