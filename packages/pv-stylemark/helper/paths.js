'use strict';

const { resolve } =  require('path');
const { realpathSync, existsSync } = require('fs');

const { defaultConfig } = require('../config/default.config');

const appDirectory = realpathSync(process.cwd());
const resolveApp = relativePath => resolve(appDirectory, relativePath);


// try to load pv.config.js
let config = defaultConfig;
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

const getAppConfig = () => {
  return config;
};

module.exports = {
  resolveApp,
  getAppConfig
};