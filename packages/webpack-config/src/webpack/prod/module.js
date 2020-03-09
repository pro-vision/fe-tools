import merge from "webpack-merge";
import webpackBundleAnalyzer from "webpack-bundle-analyzer";

// Base Config
import { defaultConfigModule } from "../base/module";
// Settings
import { basicSettings } from "./settings/basicSettings";
// Tasks
import { compileCSS } from "./tasks/compileCSS";

const additionalPlugins = {
  plugins: [],
};

if (process.env.PV_WEBPACK_STATS) {
  additionalPlugins.plugins.push(
    new webpackBundleAnalyzer.BundleAnalyzerPlugin({
      analyzerMode: process.env.PV_WEBPACK_STATS === "json" ? "disabled" : "static",
      generateStatsFile: process.env.PV_WEBPACK_STATS === "json",
      openAnalyzer: false,
      reportFilename: "report_module.html",
      statsFilename: "report_module.json",
    })
  );
}

export const prodConfigModule = merge(defaultConfigModule, basicSettings, compileCSS, additionalPlugins);
