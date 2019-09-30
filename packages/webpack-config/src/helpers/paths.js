import path from "path";
import { realpathSync, existsSync } from "fs";

import { defaultConfig } from "../config/default.config";

const appDirectory = realpathSync(process.cwd());
export const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// try to load pv.config.js
let config = defaultConfig;
const customConfigPath = resolveApp("pv.config.js");
const customConfigExists = existsSync(customConfigPath);

if (customConfigExists) {
  try {
    const pvConfig = require(customConfigPath);
    config = { ...defaultConfig, ...pvConfig };
  }
  catch {
    config = defaultConfig;
  }
}

export const getAppConfig = () => config;

export const getCustomWebpackConfig = configName =>
  new Promise(resolve => {
    let customWebpackConfig;
    const customWebpackConfigPath = resolveApp(configName);

    const customWebpackConfigExists = existsSync(customWebpackConfigPath);

    if (!customWebpackConfigExists) {
      resolve({});
    }
    else {
      try {
        customWebpackConfig = require(customWebpackConfigPath);
      }
      catch (err) {
        console.log("Failed to load config file:");
        console.error(err);
        customWebpackConfig = {};
      }
      finally {
        resolve(customWebpackConfig);
      }
    }
  });

const getJSExtName = options => {
  if (options.useReact) {
    return options.useTS ? ".tsx" : ".jsx";
  }

  return options.useTS ? ".ts" : ".js";

};

export const publicPath = process.env.PUBLIC_PATH || "/";

export const appPath = resolveApp(".");
export const appSrc = resolveApp(config.srcPath);

export const jsEntry = () => {
  if (config.jsEntry !== defaultConfig.jsEntry) return resolveApp(config.jsEntry);

  const extname = path.extname(config.jsEntry);

  return resolveApp(config.jsEntry.replace(extname, getJSExtName(config)));
};

export const jsLegacyEntry = () => {
  if (config.jsLegacyEntry !== defaultConfig.jsLegacyEntry) return resolveApp(config.jsLegacyEntry);

  const extname = path.extname(config.jsLegacyEntry);

  return resolveApp(
    config.jsLegacyEntry.replace(extname, getJSExtName(config)));
};

export const addCssEntry = () => {
  if (config.cssEntry !== defaultConfig.cssEntry) return true;
  return existsSync(resolveApp(config.cssEntry));
};

export const cssEntry = resolveApp(config.cssEntry);
export const appTarget = resolveApp(config.destPath);

const getAppName = () => {
  const { namespace } = getAppConfig();
  if (namespace === "") return "app";

  return `${namespace}.app`;
};

export const appName = getAppName();

export const shouldCopyResources = () => existsSync(resolveApp(getAppConfig().resourcesSrc));


/******************************************************************************
 ** CompileHTML helper
 ******************************************************************************/
export const useHtmlCompiler = Boolean(config.hbsEntry && config.hbsTarget);
export const hbsEntry = useHtmlCompiler ? resolveApp(config.hbsEntry) : "/";
export const hbsTarget = useHtmlCompiler ? resolveApp(config.hbsTarget) : "/";
// check if a hbs partial dir is provided
export const hbsPartialDir = {
  partialDirs: config.hbsPartialDir ? [resolveApp(config.hbsPartialDir)] : []
};

/******************************************************************************
 ** EOD CompileHTML helper
 ******************************************************************************/
