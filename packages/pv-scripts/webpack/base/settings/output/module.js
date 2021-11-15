const { appTarget, publicPath } = require("../../../../helpers/paths");
const {
  shouldAddContentHash,
} = require("../../../../helpers/buildConfigHelpers");

module.exports = {
  output: {
    path: appTarget,
    publicPath,
    filename: shouldAddContentHash()
      ? "js/[name].[contenthash].js"
      : "js/[name].js",
    chunkFilename: "resources/js/chunks/[name].[chunkhash].js",
    assetModuleFilename: "resources/modern/[base]",
  },
};
