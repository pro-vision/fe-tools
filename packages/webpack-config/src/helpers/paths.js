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

// try to load webpack.config.dev.js
let customWebpackDevConfig;
const customWebpackDevConfigPath = resolveApp('webpack.config.dev.js');
const customWebpackDevConfigExists = existsSync(customWebpackDevConfigPath);

if (customWebpackDevConfigExists) {
  try {
    console.log("Custom Webpack Dev Config detected.")
    customWebpackDevConfig = require(customWebpackDevConfigPath);
  }
  catch {
    customWebpackDevConfig = {};
  }
}

export const getCustomWebpackDevConfig= () => {
  return customWebpackDevConfig;
};

// try to load webpack.config.prod.js
let customWebpackProdConfig;
const customWebpackProdConfigPath = resolveApp('webpack.config.prod.js');
const customWebpackProdConfigExists = existsSync(customWebpackProdConfigPath);

if (customWebpackProdConfigExists) {
  try {
    console.log("Custom Webpack Prod Config detected.")
    customWebpackProdConfig = require(customWebpackProdConfigPath);
  }
  catch {
    customWebpackProdConfig = {};
  }
}

export const getCustomWebpackProdConfig= () => {
  return customWebpackProdConfig;
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