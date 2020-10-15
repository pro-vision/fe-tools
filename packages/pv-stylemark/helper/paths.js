const { resolve, join } = require("path");
const { realpathSync, existsSync } = require("fs");
const slash = require("slash");

const { defaultConfig } = require("../config/default.config");

const appDirectory = realpathSync(process.cwd());
const resolveApp = relativePath => {
  return resolve(appDirectory, relativePath);
};

// try to load pv.config.js
let config = defaultConfig;
const customConfigPath = resolveApp("pv.config.js");
const customConfigExists = existsSync(customConfigPath);

if (customConfigExists) {
  try {
    const pvConfig = require(customConfigPath);
    config = { ...defaultConfig, ...pvConfig };
  } catch {
    config = defaultConfig;
  }
}

const getAppConfig = () => {
  return config;
};

/**
 * node's `path.join`, but with forward slashes independent of the platform
 *
 * @param {...string} paths - path segments to be joined
 * @returns {string}
 */
function slashJoin(...paths) {
  return slash(join(...paths));
}

module.exports = {
  resolveApp,
  getAppConfig,
  join: slashJoin
};
