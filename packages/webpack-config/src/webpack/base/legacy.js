import merge from "webpack-merge";

// Settings
import { legacyEntrySettings } from "./settings/entry/legacy";
import { legacyOutputSettings } from "./settings/output/legacy";
import { contextSettings } from "./settings/context";
import { resolveSettings } from "./settings/resolve";
import { performanceSettings } from "./settings/performance";
// Tasks
import { getJSLoader } from "./tasks/jsLoading/getJSLoader";
import { compileLitHTML } from "./tasks/compileLitHTML";
import { compileKluntje } from "./tasks/compileKluntje";
import { loadFonts } from "./tasks/loadFonts";
import { compileShadowCSS } from "./tasks/compileShadowCSS";
import { loadHandlebars } from "./tasks/loadHandlebars";

export const defaultConfigLegacy = merge(
  legacyEntrySettings,
  legacyOutputSettings,
  contextSettings,
  resolveSettings,
  performanceSettings,
  getJSLoader("legacy"),
  compileLitHTML,
  compileKluntje,
  compileShadowCSS,
  loadFonts,
  loadHandlebars
);
