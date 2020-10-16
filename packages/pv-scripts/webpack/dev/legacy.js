const { merge } = require("webpack-merge");

// Base Config
const defaultConfigLegacy = require("../base/legacy");
// Settings
const basicSettings = require("./settings/basicSettings");
const devServerSettings = require("./settings/devServerSettings");

module.exports = merge(defaultConfigLegacy, basicSettings, devServerSettings);
