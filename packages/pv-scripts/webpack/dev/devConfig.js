const { merge } = require("webpack-merge");

// Base Config
const defaultConfigModule = require("../base/combinedConfig");
// Settings
const basicSettings = require("./settings/basicSettings");
const devServerSettings = require("./settings/devServerSettings");
// Tasks
const loadSourceMaps = require("./tasks/loadSourceMaps");

module.exports = merge(
  defaultConfigModule,
  basicSettings,
  devServerSettings,
  loadSourceMaps
);
