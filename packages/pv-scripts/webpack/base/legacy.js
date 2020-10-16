const { merge } = require("webpack-merge");

// Settings
const legacyEntrySettings = require("./settings/entry/legacy");
const legacyOutputSettings = require("./settings/output/legacy");
const contextSettings = require("./settings/context");
const resolveSettings = require("./settings/resolve");
const performanceSettings = require("./settings/performance");
// Tasks
const getJSLoader = require("./tasks/jsLoading/getJSLoader");
const compileLitHTML = require("./tasks/compileLitHTML");
const compileKluntje = require("./tasks/compileKluntje");
const loadFonts = require("./tasks/loadFonts");
const compileShadowCSS = require("./tasks/compileShadowCSS");
const loadHandlebars = require("./tasks/loadHandlebars");
const compileCSS = require("./tasks/compileCSS");

module.exports = merge(
  legacyEntrySettings,
  legacyOutputSettings,
  contextSettings,
  resolveSettings,
  performanceSettings,
  getJSLoader("legacy"),
  compileCSS,
  compileLitHTML,
  compileKluntje,
  compileShadowCSS,
  loadFonts,
  loadHandlebars
);
