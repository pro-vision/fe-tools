const {
  copyStyleguideFiles,
} = require("../gulp-tasks/lsg_tasks/copyStyleguideFiles");
const {
  assembleLSGComponents,
} = require("../gulp-tasks/assembleWrapper/assembleLSGComponents");
const {
  buildStylemark
} = require("../gulp-tasks/lsg_tasks/buildStylemark");
const {
  copyClickdummyFiles,
} = require("../gulp-tasks/clickdummy_tasks/copyClickdummyFiles");
const {
  assembleClickdummyComponents,
} = require("../gulp-tasks/assembleWrapper/assembleClickdummyComponents");
const {
  assembleClickdummyPages,
} = require("../gulp-tasks/assembleWrapper/assembleClickdummyPages");

async function buildStylemarkLsg({
  shouldCopyStyleguideFiles = true,
  shouldAssemble = true,
} = {}) {

  await Promise.all([
    shouldCopyStyleguideFiles && new Promise(resolve => copyStyleguideFiles(resolve)),
    shouldCopyStyleguideFiles && new Promise(resolve => copyClickdummyFiles(resolve)),
    shouldAssemble && new Promise(resolve => assembleClickdummyComponents(resolve)),
    shouldAssemble && new Promise(resolve => assembleClickdummyPages(resolve)),
    shouldAssemble && new Promise(resolve => assembleLSGComponents(resolve)),
  ]);

  await new Promise((resolve) => {
    return buildStylemark(resolve);
  });
};

module.exports = buildStylemarkLsg;