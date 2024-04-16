const { merge } = require("webpack-merge");

// Settings
const entrySettings = require("./settings/entry");
const outputSettings = require("./settings/output");
const baseSettings = require("./settings/baseSettings");
const contextSettings = require("./settings/context");
const resolveSettings = require("./settings/resolve");
const performanceSettings = require("./settings/performance");
// Tasks
const compileJS = require("./tasks/compileJS");
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
  entrySettings,
  outputSettings,
  baseSettings,
  contextSettings,
  resolveSettings,
  performanceSettings,
  cleanDest ? cleanDestTask : {},
  compileJS,
  useTS && enableTypeCheck ? tsTypeChecking : {},
  compileCSS,
  compileShadowCSS,
  shouldUseHtmlCompiler() ? compileHTML : {},
  loadFonts,
  loadHandlebars,
  copyStaticFiles ? copyStatic : {},
  shouldCopyResources() ? copyResourcesTask : {}
);
