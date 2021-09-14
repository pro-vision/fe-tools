const { publicPath } = require("../../../helpers/paths");
const { getBuildConfig } = require("../../../helpers/buildConfigHelpers");

const { destPath, devServerPort } = getBuildConfig();

module.exports = {
  devServer: {
    host: "0.0.0.0",
    open: false,
    hot: true,
    port: devServerPort,
    devMiddleware: {
      publicPath,
    },
    static: {
      directory: destPath,
      watch: true,
    },
    client: {
      logging: "none",
    },
  },
};
