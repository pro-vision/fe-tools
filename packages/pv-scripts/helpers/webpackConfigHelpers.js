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

function getBuildDependencies() {
  return [
    "./pv.config.js",
    "./webpack.config.js",
    "./webpack.config.dev.js",
    "./.browserslistrc",
    "./.babelrc.json",
    "./postcss.config.js",
  ]
    .map((configFile) => resolveApp(configFile))
    .filter((filePath) => existsSync(filePath));
}

module.exports = {
  getCustomWebpackConfig,
  getBuildDependencies,
};
