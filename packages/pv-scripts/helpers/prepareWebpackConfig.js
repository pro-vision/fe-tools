const webpackMerge = require("webpack-merge");
const { getConfig, getCustomWebpackConfig } = require("@pro-vision/webpack-config");

async function prepareWebpackConfig(mode) {
  const customModeConfigName = mode === "development" ? "webpack.config.dev.js" : "webpack.config.prod.js";
  const customWebpackConfig = await getCustomWebpackConfig("webpack.config.js");
  const customWebpackDevConfig = await getCustomWebpackConfig(customModeConfigName);

  return getConfig(mode).map(defaultConfig => webpackMerge(defaultConfig, customWebpackConfig, customWebpackDevConfig));
}

module.exports = {
  prepareWebpackConfig
};