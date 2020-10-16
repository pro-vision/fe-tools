const CopyWebpackPlugin = require("copy-webpack-plugin");

const { resolveApp } = require("../../../helpers/paths");

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: resolveApp("static"), to: "." }]
    })
  ]
};
