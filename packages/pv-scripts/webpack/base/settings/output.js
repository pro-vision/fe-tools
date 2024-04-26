const { appTarget, publicPath } = require("../../../helpers/paths");
const {
  shouldAddContentHash,
  getAppName,
} = require("../../../helpers/buildConfigHelpers");

module.exports = {
  output: {
    path: appTarget,
    publicPath,
    chunkLoadingGlobal: `${getAppName()}.globalLoadingChunk`,
    filename: shouldAddContentHash()
      ? "js/[name].[contenthash].js"
      : "js/[name].js",
    chunkFilename: "resources/js/chunks/[name].[chunkhash].js",
    assetModuleFilename: "resources/[base]",
  },
};
