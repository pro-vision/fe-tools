import merge from "webpack-merge";

// Base Config
import { defaultConfigLegacy } from "../base/legacy";
// Settings
import { basicSettings } from "./settings/basicSettings";
import { devServerSettings } from "./settings/devServerSettings";
// Tasks
import { legacyCompileCSS } from "./tasks/compileCSS/legacy";

export const devConfigLegacy = merge(defaultConfigLegacy, basicSettings, devServerSettings, legacyCompileCSS);
