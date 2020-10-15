const {
  copyStyleguideFiles
} = require("../gulp-tasks/lsg_tasks/copyStyleguideFiles");
const {
  assembleLSGComponents
} = require("../gulp-tasks/assembleWrapper/assembleLSGComponents");
const { buildStylemark } = require("../gulp-tasks/lsg_tasks/buildStylemark");
const {
  copyClickdummyFiles
} = require("../gulp-tasks/clickdummy_tasks/copyClickdummyFiles");
const {
  assembleClickdummyComponents
} = require("../gulp-tasks/assembleWrapper/assembleClickdummyComponents");
const {
  assembleClickdummyPages
} = require("../gulp-tasks/assembleWrapper/assembleClickdummyPages");

const buildStylemarkLsg = async () => {
  await Promise.all([
    new Promise(resolve => {
      return copyStyleguideFiles(resolve);
    }),
    new Promise(resolve => {
      return copyClickdummyFiles(resolve);
    }),
    new Promise(resolve => {
      return assembleClickdummyComponents(resolve);
    }),
    new Promise(resolve => {
      return assembleClickdummyPages(resolve);
    }),
    new Promise(resolve => {
      return assembleLSGComponents(resolve);
    })
  ]);
  await new Promise(resolve => {
    return buildStylemark(resolve);
  });
};

module.exports = buildStylemarkLsg;
