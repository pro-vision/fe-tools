import merge from "webpack-merge";

// Settings
import { moduleEntrySettings } from "./settings/entry/module";
import { moduleOutputSettings } from "./settings/output/module";
import { contextSettings } from "./settings/context";
import { resolveSettings } from "./settings/resolve";
import { performanceSettings } from "./settings/performance";
// Tasks
import { getJSLoader } from "./tasks/jsLoading/getJSLoader";
import { loadFonts } from "./tasks/loadFonts";
import { compileShadowCSS } from "./tasks/compileShadowCSS";
import { loadHandlebars } from "./tasks/loadHandlebars";
import { cleanDest } from "./tasks/cleanDest";
import { tsTypeChecking } from "./tasks/tsTypeChecking";
// CompileHTML
import { compileHTML } from "./tasks/compileHTML";
import { copyStatic } from "./tasks/copyStatic";
// Helper
import { useHtmlCompiler, getAppConfig } from "../../helpers/paths";

const { useTS, copyStaticFiles, enableTypeCheck} = getAppConfig();

export const defaultConfigModule = merge(
  moduleEntrySettings,
  moduleOutputSettings,
  contextSettings,
  resolveSettings,
  performanceSettings,
  getAppConfig().cleanDest ? cleanDest : {},
  getJSLoader("module"),
  useTS && enableTypeCheck ? tsTypeChecking : {},
  compileShadowCSS,
  useHtmlCompiler ? compileHTML : {},
  loadFonts,
  loadHandlebars,
  copyStaticFiles ? copyStatic : {}
);
