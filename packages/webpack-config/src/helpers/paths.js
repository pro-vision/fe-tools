'use strict';

import { resolve } from 'path';
import { realpathSync, existsSync } from 'fs';

import { defaultConfig } from '../config/default.config';

let config;

const appDirectory = realpathSync(process.cwd());

export const resolveApp = relativePath => resolve(appDirectory, relativePath);

const customConfigPath = resolveApp('pv.config.js')
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

export const publicPath = process.env.PUBLIC_PATH || '';

export const appPath = resolveApp('.');
export const appSrc = resolveApp(config.srcPath);
export const appTarget = resolveApp(config.destPath);