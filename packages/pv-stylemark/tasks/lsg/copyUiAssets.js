const { resolve } = require("path");
const { copy } = require("fs-extra");

const { resolveApp, getAppConfig, join } = require("../../helper/paths");

const copyUiAssets = async () => {
  const srcPath = resolve(__dirname, "../../lib/");
  const targetPath = resolveApp(join(getAppConfig().destPath, "styleguide"));
  await copy(srcPath, targetPath);
};

module.exports = {
  copyUiAssets,
};
