const { publicPath } = require("../../../helpers/paths");
const { getBuildConfig } = require("../../../helpers/buildConfigHelpers");

const { destPath, devServerPort } = getBuildConfig();

module.exports = {
  devServer: {
    host: "0.0.0.0",
    contentBase: destPath,
    publicPath,
    open: false,
    hot: true,
    quiet: true,
    clientLogLevel: "none",
    port: devServerPort,
    watchContentBase: true,
  },
};
