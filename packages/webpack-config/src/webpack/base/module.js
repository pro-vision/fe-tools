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
import { cleanDest as cleanDestTask } from "./tasks/cleanDest";
import { tsTypeChecking } from "./tasks/tsTypeChecking";
import { copyResources as copyResourcesTask } from "./tasks/copyResources";
import { compileHTML } from "./tasks/compileHTML";
import { copyStatic } from "./tasks/copyStatic";
// Helper
import {
  useHtmlCompiler,
  getAppConfig,
  shouldCopyResources
} from "../../helpers/paths";

const { useTS, copyStaticFiles, cleanDest, enableTypeCheck } = getAppConfig();

export const defaultConfigModule = merge(
  moduleEntrySettings,
  moduleOutputSettings,
  contextSettings,
  resolveSettings,
  performanceSettings,
  cleanDest ? cleanDestTask : {},
  getJSLoader("module"),
  useTS && enableTypeCheck ? tsTypeChecking : {},
  compileShadowCSS,
  useHtmlCompiler ? compileHTML : {},
  loadFonts,
  loadHandlebars,
  copyStaticFiles ? copyStatic : {},
  shouldCopyResources() ? copyResourcesTask : {}
);
