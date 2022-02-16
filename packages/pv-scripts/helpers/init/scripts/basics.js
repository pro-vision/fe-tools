const fs = require("fs-extra");

const pvConfigTemplate = require("../templates/pv.config");
const webpackConfigTemplate = require("../templates/webpack.config");
const webpackDevConfigTemplate = require("../templates/webpack.config.dev.module");
const { asyncWriteFile } = require("../io-helpers");
const { getJSExtName } = require("../../buildConfigHelpers");

const createAppFolder = async (appConfig) => {
  return await fs.ensureDir(appConfig.name);
};

const generatePvConfig = async (appConfig) => {
  const fileContent = pvConfigTemplate(appConfig);
  return await asyncWriteFile(appConfig.name, "pv.config.js", fileContent);
};

const generateWebpackConfigs = async (appConfig) => {
  const webpackConfig = webpackConfigTemplate(appConfig);
  await asyncWriteFile(appConfig.name, "webpack.config.js", webpackConfig);
  const webpackDevConfig = webpackDevConfigTemplate(appConfig);
  await asyncWriteFile(
    appConfig.name,
    "webpack.config.dev.module.js",
    webpackDevConfig
  );
};

const createEntryFiles = async (appConfig) => {
  const extName = getJSExtName(appConfig);
  await asyncWriteFile(`${appConfig.name}/src`, `index${extName}`, "");
  await asyncWriteFile(`${appConfig.name}/src`, `legacyIndex${extName}`, "");
  await asyncWriteFile(`${appConfig.name}/src`, "index.scss", "");
};

module.exports = {
  createAppFolder,
  generatePvConfig,
  generateWebpackConfigs,
  createEntryFiles,
};
