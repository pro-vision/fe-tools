const path = require("path");
const { realpathSync, existsSync } = require("fs");
const slash = require("slash");

const { defaultConfig } = require("../config/default.config");

const appDirectory = realpathSync(process.cwd());

const resolveApp = relativePath => {
  return path.resolve(appDirectory, relativePath);
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

const getCustomWebpackConfig = configName => {
  return new Promise(resolve => {
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

const getJSExtName = options => {
  if (options.useReact) {
    return options.useTS ? ".tsx" : ".jsx";
  }

  return options.useTS ? ".ts" : ".js";
};

const publicPath = process.env.PUBLIC_PATH || "/";

const appPath = resolveApp(".");
const appSrc = resolveApp(config.srcPath);

const jsEntry = () => {
  if (config.jsEntry !== defaultConfig.jsEntry)
    return resolveApp(config.jsEntry);

  const extname = path.extname(config.jsEntry);

  return resolveApp(config.jsEntry.replace(extname, getJSExtName(config)));
};

const jsLegacyEntry = () => {
  if (config.jsLegacyEntry !== defaultConfig.jsLegacyEntry)
    return resolveApp(config.jsLegacyEntry);

  const extname = path.extname(config.jsLegacyEntry);

  return resolveApp(
    config.jsLegacyEntry.replace(extname, getJSExtName(config))
  );
};

const addCssEntry = () => {
  if (config.cssEntry !== defaultConfig.cssEntry) return true;
  return existsSync(resolveApp(config.cssEntry));
};

const cssEntry = resolveApp(config.cssEntry);
const appTarget = resolveApp(config.destPath);

const getAppName = () => {
  const { namespace } = getAppConfig();
  if (namespace === "") return "app";

  return `${namespace}.app`;
};

const appName = getAppName();

const shouldCopyResources = () => {
  return existsSync(resolveApp(getAppConfig().resourcesSrc));
};

const autoConsoleClear = () => {
  return getAppConfig().autoConsoleClear;
};

/**
 * node's `path.join`, but with forward slashes independent of the platform
 *
 * @param {...string} paths - path segments to be joined
 * @returns {string}
 */
function join(...paths) {
  return slash(path.join(...paths));
}

/******************************************************************************
 ** CompileHTML helper
 ******************************************************************************/
const useHtmlCompiler = Boolean(config.hbsEntry && config.hbsTarget);
const hbsEntry = useHtmlCompiler ? resolveApp(config.hbsEntry) : "/";
const hbsTarget = useHtmlCompiler ? resolveApp(config.hbsTarget) : "/";

/******************************************************************************
 ** handlerbars-loader options
 ******************************************************************************/
const handlebarsLoaderOptions = config.handlebarsLoaderOptions;
// expect paths to be relative to ov.config.js similar to the other configurations. and convert to absolute paths
// helperDirs
if (handlebarsLoaderOptions.helperDirs)
  handlebarsLoaderOptions.helperDirs = handlebarsLoaderOptions.helperDirs.map(
    resolveApp
  );
// partialDirs
if (handlebarsLoaderOptions.partialDirs)
  handlebarsLoaderOptions.partialDirs = handlebarsLoaderOptions.partialDirs.map(
    resolveApp
  );
// runtime
if (handlebarsLoaderOptions.runtime)
  handlebarsLoaderOptions.runtime = resolveApp(handlebarsLoaderOptions.runtime);

/******************************************************************************
 ** EOD CompileHTML helper
 ******************************************************************************/

module.exports = {
  resolveApp,
  getAppConfig,
  getCustomWebpackConfig,
  publicPath,
  appPath,
  appSrc,
  jsEntry,
  jsLegacyEntry,
  addCssEntry,
  cssEntry,
  appTarget,
  appName,
  shouldCopyResources,
  autoConsoleClear,
  join,
  useHtmlCompiler,
  hbsEntry,
  hbsTarget,
  handlebarsLoaderOptions
};
