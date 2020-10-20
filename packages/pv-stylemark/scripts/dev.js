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
const { getAppConfig, join } = require("../helper/paths");

const recompileMessage = (done) => {
  console.log("Recompiling LSG...");
  done();
};

const recompiledMessage = (done) => {
  console.log("LSG Recompiled!");
  done();
};

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

const { componentsSrc, cdPagesSrc, lsgAssetsSrc, lsgIndex } = getAppConfig();

const watchFiles = () => {
  gulp.watch(
    join(componentsSrc, "**/*.md"),
    gulp.series(
      recompileMessage,
      copyStyleguideFiles,
      buildStylemark,
      recompiledMessage
    )
  );
  gulp.watch(
    join(cdPagesSrc, "**/*.hbs"),
    gulp.series(recompileMessage, assembleClickdummyPages, recompiledMessage)
  );
  gulp.watch(
    join(lsgAssetsSrc, "**/*.*"),
    gulp.series(recompileMessage, copyStyleguideFiles, recompiledMessage)
  );
  gulp.watch(
    lsgIndex,
    gulp.series(recompileMessage, copyClickdummyFiles, recompiledMessage)
  );
  for (const ext of ["hbs", "json", "yaml", "yml"]) {
    gulp.watch(
      join(componentsSrc, `**/*.${ext}`),
      gulp.series(
        recompileMessage,
        assembleClickdummyComponents,
        assembleClickdummyPages,
        assembleLSGComponents,
        buildStylemark,
        recompiledMessage
      )
    );
  }
};

const build = (done) => {
  return gulp.series(buildClickdummy, buildLSG)(done);
};

console.log("Assemble LSG in dev-mode...");

build(() => {
  console.log("LSG compiled!");
  console.log("Start LSG watch...");
  watchFiles();
});
