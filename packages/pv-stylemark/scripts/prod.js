const gulp = require("gulp");

// Assemble Clickdummy
const {
  assembleClickdummyComponents,
} = require("../gulp-tasks/assembleWrapper/assembleClickdummyComponents");
const {
  assembleClickdummyPages,
} = require("../gulp-tasks/assembleWrapper/assembleClickdummyPages");
const {
  copyClickdummyFiles,
} = require("../gulp-tasks/clickdummy_tasks/copyClickdummyFiles");
// Assemble Stylemark
const {
  assembleLSGComponents,
} = require("../gulp-tasks/assembleWrapper/assembleLSGComponents");
const {
  copyStyleguideFiles,
} = require("../gulp-tasks/lsg_tasks/copyStyleguideFiles");
const { buildStylemark } = require("../gulp-tasks/lsg_tasks/buildStylemark");

const buildClickdummy = (done) => {
  return gulp.series(
    assembleClickdummyComponents,
    assembleClickdummyPages,
    copyClickdummyFiles
  )(done);
};

const buildLSG = (done) => {
  return gulp.series(
    assembleLSGComponents,
    copyStyleguideFiles,
    buildStylemark
  )(done);
};

const build = (done) => {
  return gulp.series(buildClickdummy, buildLSG)(done);
};

console.log("Assemble LSG...");

build(() => {
  console.log("LSG assembled!");
});
