const devConfig = require("./dev/devConfig");
const prodConfig = require("./prod/prodConfig");

const getConfig = (runMode) => {
  if (runMode === "development") {
    return devConfig;
  }

  return prodConfig;
};

module.exports = {
  getConfig,
};
