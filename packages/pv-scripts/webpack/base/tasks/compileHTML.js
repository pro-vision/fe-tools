const HtmlWebpackPlugin = require("html-webpack-plugin");

const { hbsEntry, hbsTarget } = require("../../../helpers/paths");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: hbsEntry,
      filename: hbsTarget
    })
  ]
};
