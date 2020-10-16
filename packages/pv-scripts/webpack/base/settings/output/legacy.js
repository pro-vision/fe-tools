const { appTarget, publicPath } = require("../../../../helpers/paths");

module.exports = {
  output: {
    path: appTarget,
    publicPath,
    filename: "js/[name].legacy.js",
    chunkFilename: "resources/js/chunks/[name].legacy.[chunkhash].js"
  }
};
