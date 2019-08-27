const { src, dest, parallel} = require('gulp');

const copyMdFiles = () => 
  src('./src/components/**/*.md')
    .pipe(dest('./target/lsg_components'));

const copyAssets = () =>
  src('./src/assets/**')
    .pipe(dest('./target/assets'));

const copyStyleguideFiles = (done) => parallel(copyMdFiles, copyAssets)(done);

module.exports = {
  copyStyleguideFiles
};