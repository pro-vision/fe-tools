const { src, dest, parallel} = require('gulp');

const { getAppConfig } = require('../../../helper/paths');

const copyMdFiles = () => 
  src('./src/components/**/*.md')
    .pipe(dest(`${getAppConfig().destPath}/lsg_components`));

const copyAssets = () =>
  src('./src/assets/**')
    .pipe(dest(`${getAppConfig().destPath}/assets`));

const copyStyleguideFiles = (done) => parallel(copyMdFiles, copyAssets)(done);

module.exports = {
  copyStyleguideFiles
};