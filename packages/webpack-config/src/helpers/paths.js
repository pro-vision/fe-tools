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
      catch {
        customWebpackConfig = {};
      }
      finally {
        resolve(customWebpackConfig);
      }
    }
  });

export const publicPath = process.env.PUBLIC_PATH || "/";

export const appPath = resolveApp(".");
export const appSrc = resolveApp(config.srcPath);
export const jsEntry = resolveApp(config.jsEntry);
export const jsLegacyEntry = resolveApp(config.jsLegacyEntry);
export const cssEntry = resolveApp(config.cssEntry);
export const appTarget = resolveApp(config.destPath);

const getAppName = () => {
  const { namespace } = getAppConfig();
  if (namespace === "") return "app";

  return `${namespace}.app`;
};

export const appName = getAppName();


/******************************************************************************
 ** CompileHTML helper
 ******************************************************************************/

// check if a hbs partial dir is provided
export const hbsPartialDir = {
  partialDirs: config.hbsPartialDir ? [resolveApp(config.hbsPartialDir)] : []
};

const getRequiredHtmlCompilerConfig = () =>
  Boolean(config.hbsEntry && config.hbsTarget);

export const useHtmlCompiler = getRequiredHtmlCompilerConfig();
export const hbsEntry = useHtmlCompiler ? resolveApp(config.hbsEntry) : "/";
export const hbsTarget = resolveApp(config.hbsTarget);

/******************************************************************************
 ** EOD CompileHTML helper
 ******************************************************************************/
