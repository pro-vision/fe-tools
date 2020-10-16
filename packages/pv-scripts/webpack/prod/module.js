const { merge } = require("webpack-merge");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");

// Base Config
const defaultConfigModule = require("../base/module");
// Settings
const basicSettings = require("./settings/basicSettings");

const additionalPlugins = {
  plugins: []
};

if (process.env.PV_WEBPACK_STATS) {
  additionalPlugins.plugins.push(
    new webpackBundleAnalyzer.BundleAnalyzerPlugin({
      analyzerMode:
        process.env.PV_WEBPACK_STATS === "json" ? "disabled" : "static",
      generateStatsFile: process.env.PV_WEBPACK_STATS === "json",
      openAnalyzer: false,
      reportFilename: "report_module.html",
      statsFilename: "report_module.json"
    })
  );
}

module.exports = merge(defaultConfigModule, basicSettings, additionalPlugins);
