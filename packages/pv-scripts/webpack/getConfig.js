const devConfigModule = require("./dev/module");
const devConfigLegacy = require("./dev/legacy");
const prodConfigModule = require("./prod/module");
const prodConfigLegacy = require("./prod/legacy");

const getConfig = (runMode) => {
  if (runMode === "development") {
    return [devConfigModule, devConfigLegacy];
  }

  return [prodConfigModule, prodConfigLegacy];
};

module.exports = {
  getConfig,
};
