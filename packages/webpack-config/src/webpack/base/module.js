import merge from "webpack-merge";

// Settings
import { moduleEntrySettings } from "./settings/entry/module";
import { moduleOutputSettings } from "./settings/output/module";
import { contextSettings } from "./settings/context";
import { resolveSettings } from "./settings/resolve";
// Tasks
import { getJSLoader } from "./tasks/jsLoading/getJSLoader";
import { loadFonts } from "./tasks/loadFonts";
import { compileShadowCSS } from "./tasks/compileShadowCSS";
import { loadHandlebars } from "./tasks/loadHandlebars";
import { copyStatic } from "./tasks/copyStatic";
// Helper
import { getAppConfig } from "../../helpers/paths";

export const defaultConfigModule = merge(
  moduleEntrySettings,
  moduleOutputSettings,
  contextSettings,
  resolveSettings,
  getJSLoader("module"),
  compileShadowCSS,
  loadFonts,
  loadHandlebars,
  getAppConfig().copyStaticFiles ? copyStatic : {}
);
