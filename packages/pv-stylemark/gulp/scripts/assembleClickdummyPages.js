const handlebarsHelpers = require('handlebars-helpers');

const { resolveApp } = require('../../helper/paths');
const { assembleFiles } = require('./assembleFiles');

assembleFiles({
  layouts: resolveApp("src/templates/**/*.hbs"),
  partials: resolveApp("src/components/**/*.hbs"),
  pages: resolveApp("src/pages/**/*.hbs"),
  data: resolveApp("src/components/**/*.json"),
  dest: resolveApp("target/pages"),
  helpers: [
    handlebarsHelpers(),
    resolveApp('helpers/handlebarsHelper/*.js')
  ]
});
