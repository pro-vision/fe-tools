const { merge } = require("webpack-merge");

// Base Config
const defaultConfigModule = require("../base/module");
// Settings
const basicSettings = require("./settings/basicSettings");
const devServerSettings = require("./settings/devServerSettings");
// Tasks
const moduleLoadSourceMaps = require("./tasks/loadSourceMaps/module");

module.exports = merge(
  defaultConfigModule,
  basicSettings,
  devServerSettings,
  moduleLoadSourceMaps
);
