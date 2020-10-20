const path = require("path");
const { realpathSync, existsSync } = require("fs");

const defaultConfig = require("../config/default.config");

const appDirectory = realpathSync(process.cwd());

const resolveApp = (relativePath) => {
  return path.resolve(appDirectory, relativePath);
};

const getBuildConfig = () => {
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
  return config;
};

const getJSExtName = (options) => {
  if (options.useReact) {
    return options.useTS ? ".tsx" : ".jsx";
  }

  return options.useTS ? ".ts" : ".js";
};

const getAppName = () => {
  const { namespace } = getBuildConfig();
  if (namespace === "") return "app";

  return `${namespace}.app`;
};

const autoConsoleClearEnabled = () => {
  return getBuildConfig().autoConsoleClear;
};

const shouldCopyResources = () => {
  return existsSync(resolveApp(getBuildConfig().resourcesSrc));
};

const shouldAddCssEntry = () => {
  const config = getBuildConfig();
  if (config.cssEntry !== defaultConfig.cssEntry) return true;
  return existsSync(resolveApp(config.cssEntry));
};

const shouldUseHtmlCompiler = () => {
  const config = getBuildConfig();
  return Boolean(config.hbsEntry && config.hbsTarget);
};

const getHandlebarsLoaderOptions = () => {
  const handlebarsLoaderOptions = getBuildConfig().handlebarsLoaderOptions;
  // expect paths to be relative to pv.config.js similar to the other configurations. and convert to absolute paths
  // helperDirs
  if (handlebarsLoaderOptions.helperDirs) {
    handlebarsLoaderOptions.helperDirs = handlebarsLoaderOptions.helperDirs.map(
      resolveApp
    );
  }
  // partialDirs
  if (handlebarsLoaderOptions.partialDirs) {
    handlebarsLoaderOptions.partialDirs = handlebarsLoaderOptions.partialDirs.map(
      resolveApp
    );
  }

  // runtime
  if (handlebarsLoaderOptions.runtime) {
    handlebarsLoaderOptions.runtime = resolveApp(
      handlebarsLoaderOptions.runtime
    );
  }

  return handlebarsLoaderOptions;
};

module.exports = {
  getBuildConfig,
  getJSExtName,
  getAppName,
  autoConsoleClearEnabled,
  shouldCopyResources,
  shouldAddCssEntry,
  shouldUseHtmlCompiler,
  getHandlebarsLoaderOptions,
};
