const CopyWebpackPlugin = require("copy-webpack-plugin");

const { resolveApp } = require("../../../helpers/paths");
const { getBuildConfig } = require("../../../helpers/buildConfigHelpers");

const { resourcesSrc } = getBuildConfig();

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: resolveApp(resourcesSrc), to: resourcesSrc }]
    })
  ]
};
