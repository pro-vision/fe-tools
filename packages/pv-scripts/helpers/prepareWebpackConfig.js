const { merge } = require("webpack-merge");
const {
  getConfig,
  getCustomWebpackConfig
} = require("@pro-vision/webpack-config");

async function prepareWebpackConfig(mode) {
  const customModeConfigName =
    mode === "development" ? "webpack.config.dev" : "webpack.config.prod";
  const customWebpackConfig = await getCustomWebpackConfig("webpack.config.js");
  const customWebpackModuleConfig = await getCustomWebpackConfig(
    "webpack.config.module.js"
  );
  const customWebpackLegacyConfig = await getCustomWebpackConfig(
    "webpack.config.legacy.js"
  );
  const customWebpackModeConfig = await getCustomWebpackConfig(
    `${customModeConfigName}.js`
  );
  const customWebpackModeModuleConfig = await getCustomWebpackConfig(
    `${customModeConfigName}.module.js`
  );
  const customWebpackModeLegacyConfig = await getCustomWebpackConfig(
    `${customModeConfigName}.legacy.js`
  );

  const customModuleConfig = merge(
    customWebpackConfig,
    customWebpackModuleConfig,
    customWebpackModeConfig,
    customWebpackModeModuleConfig
  );

  const customLegacyConfig = merge(
    customWebpackConfig,
    customWebpackLegacyConfig,
    customWebpackModeConfig,
    customWebpackModeLegacyConfig
  );

  const [defaultModuleConfig, defaultLegacyConfig] = getConfig(mode);

  return [
    merge(defaultModuleConfig, customModuleConfig),
    merge(defaultLegacyConfig, customLegacyConfig)
  ];
}

module.exports = {
  prepareWebpackConfig
};
