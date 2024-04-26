const { merge } = require("webpack-merge");

const { getCustomWebpackConfig } = require("../helpers/webpackConfigHelpers");
const { getConfig } = require("../webpack/getConfig");

async function prepareWebpackConfig(mode) {
  const customModeConfigName =
    mode === "development" ? "webpack.config.dev" : "webpack.config.prod";
  const customWebpackConfig = await getCustomWebpackConfig("webpack.config.js");
  const customWebpackModeConfig = await getCustomWebpackConfig(
    `${customModeConfigName}.js`
  );

  const customModuleConfig = merge(
    customWebpackConfig,
    customWebpackModeConfig
  );

  const defaultModuleConfig = getConfig(mode);

  return merge(defaultModuleConfig, customModuleConfig);
}

module.exports = {
  prepareWebpackConfig,
};
