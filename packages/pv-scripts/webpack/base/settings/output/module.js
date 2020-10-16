const { appTarget, publicPath } = require("../../../../helpers/paths");

module.exports = {
  output: {
    path: appTarget,
    publicPath,
    filename: "js/[name].js",
    chunkFilename: "resources/js/chunks/[name].[chunkhash].js"
  }
};
