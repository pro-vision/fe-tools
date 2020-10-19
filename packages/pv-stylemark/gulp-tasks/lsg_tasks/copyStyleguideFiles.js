const { src, dest, parallel } = require("gulp");

const { getAppConfig, join } = require("../../helper/paths");

const { destPath, lsgAssetsSrc, componentsSrc } = getAppConfig();

const copyMdFiles = () => {
  return src(join(componentsSrc, "**/*.md")).pipe(
    dest(join(destPath, "lsg_components"))
  );
};

const copyAssets = () => {
  return src(join(lsgAssetsSrc, "**")).pipe(dest(join(destPath, "lsg_assets")));
};

const copyStyleguideFiles = (done) => {
  return parallel(copyMdFiles, copyAssets)(done);
};

module.exports = {
  copyStyleguideFiles,
};
