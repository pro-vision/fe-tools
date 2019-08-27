const { src, dest, parallel} = require('gulp');

const copyRoot = () => 
  src('src/styleguide/index.html')
    .pipe(dest('target'));


const copyClickdummyFiles = (done) => parallel(copyRoot)(done);

module.exports = {
  copyClickdummyFiles
};