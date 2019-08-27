const assemble = require('assemble');
const extname = require('gulp-extname');
const plumber = require('gulp-plumber');

const assembleFiles = (config) => {
  const app = assemble();

  app.layouts(config.layouts);
  app.partials(config.partials);
  app.pages(config.pages);
  app.data(config.data);
  app.helpers(config.helpers);

  app
    .toStream('pages')
    .pipe(plumber())
    .pipe(extname())
    .pipe(app.renderFile())
    .pipe(app.dest(config.dest));
};

module.exports = {
  assembleFiles
}