const {
  copyStyleguideFiles,
} = require("../gulp-tasks/lsg_tasks/copyStyleguideFiles");
const {
  assembleLSGComponents,
} = require("../gulp-tasks/lsg_tasks/assembleLSGComponents");
const { buildStylemark } = require("../gulp-tasks/lsg_tasks/buildStylemark");
const {
  copyClickdummyFiles,
} = require("../gulp-tasks/clickdummy_tasks/copyClickdummyFiles");
const {
  assembleClickdummyComponents,
} = require("../gulp-tasks/clickdummy_tasks/assembleClickdummyComponents");
const {
  assembleClickdummyPages,
} = require("../gulp-tasks/clickdummy_tasks/assembleClickdummyPages");

async function buildStylemarkLsg({
  shouldCopyStyleguideFiles = true,
  shouldAssemble = true,
} = {}) {
  await Promise.all([
    shouldCopyStyleguideFiles &&
      new Promise((resolve) => copyStyleguideFiles(resolve)),
    shouldCopyStyleguideFiles &&
      new Promise((resolve) => copyClickdummyFiles(resolve)),
    shouldAssemble && assembleClickdummyComponents(),
    shouldAssemble & assembleClickdummyPages(),
    shouldAssemble && assembleLSGComponents(),
  ]);

  await new Promise((resolve) => {
    return buildStylemark(resolve);
  });
}

module.exports = buildStylemarkLsg;
