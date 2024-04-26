const { merge } = require("webpack-merge");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");

// Base Config
const defaultConfigModule = require("../base/combinedConfig");
// Settings
const basicSettings = require("./settings/basicSettings");

const additionalPlugins = {
  plugins: [],
};

if (process.env.PV_WEBPACK_STATS) {
  const outputJson = process.env.PV_WEBPACK_STATS === "json";
  additionalPlugins.plugins.push(
    new webpackBundleAnalyzer.BundleAnalyzerPlugin({
      analyzerMode: outputJson ? "json" : "static",
      generateStatsFile: outputJson,
      openAnalyzer: false,
      reportFilename: `report${outputJson ? ".json" : ".html"}`,
      statsFilename: "webpack_stats.json",
    })
  );
}

module.exports = merge(defaultConfigModule, basicSettings, additionalPlugins);
