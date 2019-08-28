'use strict';

const gulp = require('gulp');

// Assemble Clickdummy
const { assembleClickdummyComponents } = require('../gulp/tasks/clickdummy_tasks/assembleClickdummyComponents');
const { assembleClickdummyPages } = require('../gulp/tasks/clickdummy_tasks/assembleClickdummyPages');
const { copyClickdummyFiles } = require('../gulp/tasks/clickdummy_tasks/copyClickdummyFiles');

// Assemble Stylemark
const { assembleLSGComponents } = require('../gulp/tasks/lsg_tasks/assembleLSGComponents');
const { copyStyleguideFiles } = require('../gulp/tasks/lsg_tasks/copyStyleguideFiles');
const { buildStylemark } = require('../gulp/tasks/lsg_tasks/buildStylemark');

const recompileMessage = (done) => {
  console.log('Recompiling LSG...');
  done();
};

const recompiledMessage = (done) => {
  console.log('LSG Recompiled!');
  done();
};

const buildClickdummy = (done) => gulp.series(assembleClickdummyComponents, assembleClickdummyPages, copyClickdummyFiles)(done);

const buildLSG = (done) => gulp.series(assembleLSGComponents, copyStyleguideFiles, buildStylemark)(done);


const { getAppConfig } = require('../helper/paths');
const { componentsHome, cdPagesHome, lsgAssetsHome, lsgIndex } = getAppConfig();

const watchFiles = () => {
  gulp.watch(`${componentsHome}**/*.md`, gulp.series(recompileMessage, copyStyleguideFiles, buildStylemark, recompiledMessage));
  gulp.watch(`${cdPagesHome}**/*.hbs`, gulp.series(recompileMessage, assembleClickdummyPages, recompiledMessage));
  gulp.watch(`${lsgAssetsHome}**/*.*`, gulp.series(recompileMessage, copyStyleguideFiles, recompiledMessage));
  gulp.watch(lsgIndex, gulp.series(recompileMessage, copyClickdummyFiles, recompiledMessage));
  gulp.watch(
    `${componentsHome}**/*.hbs`,
    gulp.series(
      recompileMessage,
      assembleClickdummyComponents,
      assembleClickdummyPages,
      assembleLSGComponents,
      buildStylemark,
      recompiledMessage
    )
  );
  gulp.watch(`${componentsHome}**/*.json`, gulp.series(recompileMessage, assembleClickdummyComponents, assembleClickdummyPages, assembleLSGComponents, buildStylemark, recompiledMessage));  
};

const build = (done) => gulp.series(buildClickdummy, buildLSG)(done);

console.log('Assemble LSG in dev-mode...');

build(() => {
  console.log('LSG compiled!');
  console.log('Start LSG watch...');
  watchFiles();
});