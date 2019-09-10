const webpackMerge = require("webpack-merge");
const { getConfig, getCustomWebpackConfig } = require("@pro-vision/webpack-config");

async function prepareWebpackConfig(mode) {
  const customModeConfigName = mode === "development" ? "webpack.config.dev" : "webpack.config.prod";
  const customWebpackConfig = await getCustomWebpackConfig("webpack.config.js");
  const customWebpackModuleConfig = await getCustomWebpackConfig("webpack.config.module.js");
  const customWebpackLegacyConfig = await getCustomWebpackConfig("webpack.config.legacy.js");
  const customWebpackStageConfig = await getCustomWebpackConfig(`${customModeConfigName}.js`);
  const customWebpackStageModuleConfig = await getCustomWebpackConfig(`${customModeConfigName}.module.js`);
  const customWebpackStageLegacyConfig = await getCustomWebpackConfig(`${customModeConfigName}.legacy.js`);

  const customModuleConfig = webpackMerge(
    customWebpackConfig,
    customWebpackModuleConfig,
    customWebpackStageConfig,
    customWebpackStageModuleConfig
  );

  const customLegacyConfig = webpackMerge(
    customWebpackConfig,
    customWebpackLegacyConfig,
    customWebpackStageConfig,
    customWebpackStageLegacyConfig
  );

  const [defaultModuleConfig, defaultLegacyConfig] = getConfig(mode);

  return [
    webpackMerge(defaultModuleConfig, customModuleConfig),
    webpackMerge(defaultLegacyConfig, customLegacyConfig)
  ];
}

module.exports = {
  prepareWebpackConfig
};