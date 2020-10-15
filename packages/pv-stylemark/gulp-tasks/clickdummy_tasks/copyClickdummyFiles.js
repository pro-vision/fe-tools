const { src, dest, parallel } = require("gulp");

const { getAppConfig } = require("../../helper/paths");

const { destPath, lsgIndex } = getAppConfig();

const copyRoot = () => {
  return src(lsgIndex).pipe(dest(destPath));
};

const copyClickdummyFiles = done => {
  return parallel(copyRoot)(done);
};

module.exports = {
  copyClickdummyFiles
};
