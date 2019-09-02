import merge from "webpack-merge";

// Settings
import { legacyEntrySettings } from "./settings/entry/legacy";
import { legacyOutputSettings } from "./settings/output/legacy";
import { contextSettings } from "./settings/context";
import { resolveSettings } from "./settings/resolve";
// Tasks
import { getJSLoader } from "./tasks/jsLoading/getJSLoader";
import { compileLitHTML } from "./tasks/compileLitHTML";
import { loadFonts } from "./tasks/loadFonts";
import { compileShadowCSS } from "./tasks/compileShadowCSS";
import { loadHandlebars } from "./tasks/loadHandlebars";
import { copyStatic } from "./tasks/copyStatic";
// Helper
import { getAppConfig } from "../../helpers/paths";

export const defaultConfigLegacy = merge(
  legacyEntrySettings,
  legacyOutputSettings,
  contextSettings,
  resolveSettings,
  getJSLoader("legacy"),
  compileLitHTML,
  compileShadowCSS,
  loadFonts,
  loadHandlebars,
  getAppConfig().copyStaticFiles ? copyStatic : {}
);
