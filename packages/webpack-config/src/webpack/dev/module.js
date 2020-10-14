import { merge } from "webpack-merge";

// Base Config
import { defaultConfigModule } from "../base/module";
// Settings
import { basicSettings } from "./settings/basicSettings";
import { devServerSettings } from "./settings/devServerSettings";
// Tasks
import { moduleCompileCSS } from "./tasks/compileCSS/module";
import { moduleLoadSourceMaps } from "./tasks/loadSourceMaps/module";

export const devConfigModule = merge(
  defaultConfigModule,
  basicSettings,
  devServerSettings,
  moduleCompileCSS,
  moduleLoadSourceMaps
);
