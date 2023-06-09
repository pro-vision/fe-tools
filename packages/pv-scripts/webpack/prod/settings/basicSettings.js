const setting = {
  mode: "production",
  devtool: "source-map",
  stats: "errors-only",
  bail: true,
};

if (process.env.PV_WEBPACK_STATS) {
  setting.optimization = {
    // when modules get concatenated, the individual info gets lost
    concatenateModules: false,
  };
}

module.exports = setting;
