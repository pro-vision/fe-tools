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
// CompileHTML
import { compileHTML } from "./tasks/compileHTML";
import { copyStatic } from "./tasks/copyStatic";
// Helper
import { useHtmlCompiler, getAppConfig } from "../../helpers/paths";

export const defaultConfigModule = merge(
  moduleEntrySettings,
  moduleOutputSettings,
  contextSettings,
  resolveSettings,
  performanceSettings,
  getJSLoader("module"),
  compileShadowCSS,
  useHtmlCompiler ? compileHTML : {},
  loadFonts,
  loadHandlebars,
  getAppConfig().copyStaticFiles ? copyStatic : {}
);
