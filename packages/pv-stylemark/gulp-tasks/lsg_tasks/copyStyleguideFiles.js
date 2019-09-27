const { src, dest, parallel} = require("gulp");
const { join } = require("path");

const { getAppConfig } = require("../../helper/paths");

const {destPath, lsgAssetsSrc, componentsSrc} = getAppConfig();

const copyMdFiles = () =>
  src(join(componentsSrc, "**/*.md"))
    .pipe(dest(join(destPath, "lsg_components")));

const copyAssets = () =>
  src(join(lsgAssetsSrc, "**"))
    .pipe(dest(join(destPath, "lsg_assets")));

const copyStyleguideFiles = done => parallel(copyMdFiles, copyAssets)(done);

module.exports = {
  copyStyleguideFiles
};