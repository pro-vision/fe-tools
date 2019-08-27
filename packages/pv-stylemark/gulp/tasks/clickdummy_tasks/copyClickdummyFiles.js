const { src, dest, parallel} = require('gulp');

const { getAppConfig } = require('../../../helper/paths');

const copyRoot = () => 
  src('src/styleguide/index.html')
    .pipe(dest(getAppConfig().destPath));


const copyClickdummyFiles = (done) => parallel(copyRoot)(done);

module.exports = {
  copyClickdummyFiles
};