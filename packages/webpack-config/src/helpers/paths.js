'use strict';

import { resolve } from 'path';
import { realpathSync, existsSync } from 'fs';

import { defaultConfig } from '../config/default.config';

const appDirectory = realpathSync(process.cwd());
export const resolveApp = relativePath => resolve(appDirectory, relativePath);

// try to load pv.config.js
let config;
const customConfigPath = resolveApp('pv.config.js');
const customConfigExists = existsSync(customConfigPath);

if (customConfigExists) {
  try {
    const pvConfig = require(customConfigPath);
    config = {...defaultConfig, ...pvConfig};
  }
  catch {
    config = defaultConfig;
  }
}

export const getAppConfig = () => {
  return config;
};

// try to load webpack.config.js
let customWebpackConfig;
const customWebpackConfigPath = resolveApp('webpack.config.js');
const customWebpackConfigExists = existsSync(customWebpackConfigPath);

if (customWebpackConfigExists) {
  try {
    console.log("Custom Webpack Config detected.")
    customWebpackConfig = require(customWebpackConfigPath);
  }
  catch {
    customWebpackConfig = {};
  }
}

export const getCustomWebpackConfig= () => {
  return customWebpackConfig;
};

export const publicPath = process.env.PUBLIC_PATH || '/';

export const appPath = resolveApp('.');
export const appSrc = resolveApp(config.srcPath);
export const appTarget = resolveApp(config.destPath);

const getAppName = () => {
  const { namespace } = getAppConfig();
  if (namespace ==='') return 'app';
  
  return `${namespace}.app`;
}

export const appName = getAppName();