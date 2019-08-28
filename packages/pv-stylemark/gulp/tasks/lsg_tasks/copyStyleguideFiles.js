const { src, dest, parallel} = require('gulp');

const { getAppConfig } = require('../../../helper/paths');

const {destPath, lsgAssetsHome, componentsHome} = getAppConfig();

const copyMdFiles = () => 
  src(`${componentsHome}**/*.md`)
    .pipe(dest(`${destPath}/lsg_components`));

const copyAssets = () =>
  src(`${lsgAssetsHome}**`)
    .pipe(dest(`${destPath}/assets`));

const copyStyleguideFiles = (done) => parallel(copyMdFiles, copyAssets)(done);

module.exports = {
  copyStyleguideFiles
};