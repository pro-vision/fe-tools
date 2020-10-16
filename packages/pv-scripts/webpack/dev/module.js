const { merge } = require("webpack-merge");

// Base Config
const defaultConfigModule = require("../base/module");
// Settings
const basicSettings = require("./settings/basicSettings");
const devServerSettings = require("./settings/devServerSettings");
// Tasks
const moduleCompileCSS = require("./tasks/compileCSS/module");
const moduleLoadSourceMaps = require("./tasks/loadSourceMaps/module");

module.exports = merge(
  defaultConfigModule,
  basicSettings,
  devServerSettings,
  moduleCompileCSS,
  moduleLoadSourceMaps
);
