const {
  getBuildDependencies,
} = require("../../../helpers/webpackConfigHelpers");

module.exports = {
  mode: "development",
  devtool: "source-map",
  infrastructureLogging: {
    level: "none",
  },
  stats: "errors-only",
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: getBuildDependencies(),
    },
  },
};
