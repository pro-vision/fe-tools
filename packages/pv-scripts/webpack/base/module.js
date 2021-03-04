const { merge } = require("webpack-merge");

// Settings
const moduleEntrySettings = require("./settings/entry/module");
const moduleOutputSettings = require("./settings/output/module");
const contextSettings = require("./settings/context");
const resolveSettings = require("./settings/resolve");
const performanceSettings = require("./settings/performance");
// Tasks
const getJSLoader = require("./tasks/jsLoading/getJSLoader");
const loadFonts = require("./tasks/loadFonts");
const compileShadowCSS = require("./tasks/compileShadowCSS");
const loadHandlebars = require("./tasks/loadHandlebars");
const cleanDestTask = require("./tasks/cleanDest");
const tsTypeChecking = require("./tasks/tsTypeChecking");
const copyResourcesTask = require("./tasks/copyResources");
const compileHTML = require("./tasks/compileHTML");
const copyStatic = require("./tasks/copyStatic");
const compileCSS = require("./tasks/compileCSS");
// Helper
const {
  getBuildConfig,
  shouldCopyResources,
  shouldUseHtmlCompiler,
} = require("../../helpers/buildConfigHelpers");

const { useTS, copyStaticFiles, cleanDest, enableTypeCheck } = getBuildConfig();

module.exports = merge(
  moduleEntrySettings,
  moduleOutputSettings,
  contextSettings,
  resolveSettings,
  performanceSettings,
  cleanDest ? cleanDestTask : {},
  getJSLoader("module"),
  useTS && enableTypeCheck ? tsTypeChecking : {},
  compileCSS,
  compileShadowCSS,
  shouldUseHtmlCompiler() ? compileHTML : {},
  loadFonts,
  loadHandlebars,
  copyStaticFiles ? copyStatic : {},
  shouldCopyResources() ? copyResourcesTask : {}
);
