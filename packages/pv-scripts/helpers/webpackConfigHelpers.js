const { existsSync } = require("fs");

const { resolveApp } = require("./paths");

const getCustomWebpackConfig = (configName) => {
  return new Promise((resolve) => {
    let customWebpackConfig;
    const customWebpackConfigPath = resolveApp(configName);

    const customWebpackConfigExists = existsSync(customWebpackConfigPath);

    if (!customWebpackConfigExists) {
      resolve({});
    } else {
      try {
        customWebpackConfig = require(customWebpackConfigPath);
      } catch (err) {
        console.log("Failed to load config file:");
        console.error(err);
        customWebpackConfig = {};
      } finally {
        resolve(customWebpackConfig);
      }
    }
  });
};

module.exports = {
  getCustomWebpackConfig,
};
