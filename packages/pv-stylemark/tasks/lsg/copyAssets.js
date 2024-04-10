
const { basename } = require("path");
const { copy } = require("fs-extra");

const { resolveApp, getAppConfig, join } = require("../../helper/paths");

async function copyAssets(config) {
  if (!config.assets) return;

  for (const assetPath of config.assets) {
    const srcPath = resolveApp(assetPath);
    const targetPath = resolveApp(join(getAppConfig().destPath, "styleguide", basename(assetPath)));
    try {
      await copy(srcPath, targetPath);
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = {
  copyAssets,
};
