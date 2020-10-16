const { merge } = require("webpack-merge");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");

// Base Config
const defaultConfigLegacy = require("../base/legacy");
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
      reportFilename: "report_legacy.html",
      statsFilename: "report_legacy.json"
    })
  );
}

module.exports = merge(defaultConfigLegacy, basicSettings, additionalPlugins);
