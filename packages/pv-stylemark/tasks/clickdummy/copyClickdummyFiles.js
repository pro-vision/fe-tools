const { copy } = require("fs-extra");

const { getAppConfig, resolveApp, join } = require("../../helper/paths");

const copyLsgIndex = async () => {
  const { destPath, lsgIndex } = getAppConfig();
  await copy(resolveApp(lsgIndex), resolveApp(join(destPath, "index.html")));
};

const copyClickdummyFiles = async () => {
  await copyLsgIndex();
};

module.exports = {
  copyClickdummyFiles,
};
