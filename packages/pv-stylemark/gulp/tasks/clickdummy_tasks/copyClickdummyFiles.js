const { src, dest, parallel} = require('gulp');

const { getAppConfig } = require('../../../helper/paths');

const {destPath, lsgIndex} = getAppConfig();

const copyRoot = () => 
  src(lsgIndex)
    .pipe(dest(destPath));


const copyClickdummyFiles = (done) => parallel(copyRoot)(done);

module.exports = {
  copyClickdummyFiles
};