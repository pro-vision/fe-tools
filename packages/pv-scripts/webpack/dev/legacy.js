const { merge } = require("webpack-merge");

// Base Config
const defaultConfigLegacy = require("../base/legacy");
// Settings
const basicSettings = require("./settings/basicSettings");
const devServerSettings = require("./settings/devServerSettings");
// Tasks
const legacyCompileCSS = require("./tasks/compileCSS/legacy");

module.exports = merge(
  defaultConfigLegacy,
  basicSettings,
  devServerSettings,
  legacyCompileCSS
);
