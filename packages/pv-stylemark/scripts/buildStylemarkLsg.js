const { copyStyleguideFiles } = require("../gulp-tasks/lsg_tasks/copyStyleguideFiles");
const { assembleLSGComponents } = require("../gulp-tasks/lsg_tasks/assembleLSGComponents");
const { buildStylemark } = require("../gulp-tasks/lsg_tasks/buildStylemark");
const { copyClickdummyFiles } = require("../gulp-tasks/clickdummy_tasks/copyClickdummyFiles");
const { assembleClickdummyComponents } = require("../gulp-tasks/clickdummy_tasks/assembleClickdummyComponents");
const { assembleClickdummyPages } = require("../gulp-tasks/clickdummy_tasks/assembleClickdummyPages");

const buildStylemarkLsg = async () => {

  await Promise.all([
    new Promise(resolve => copyStyleguideFiles(resolve)),
    new Promise(resolve => copyClickdummyFiles(resolve)),
    assembleClickdummyComponents(),
    assembleClickdummyPages(),
    assembleLSGComponents()
  ]);
  await new Promise(resolve => buildStylemark(resolve));
};

module.exports = buildStylemarkLsg;