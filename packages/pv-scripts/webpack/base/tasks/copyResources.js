const CopyWebpackPlugin = require("copy-webpack-plugin");

const { resolveApp, getAppConfig } = require("../../../helpers/paths");

const { resourcesSrc } = getAppConfig();

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: resolveApp(resourcesSrc), to: resourcesSrc }]
    })
  ]
};
