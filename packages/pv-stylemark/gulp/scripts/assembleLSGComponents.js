const handlebarsHelpers = require('handlebars-helpers');

const { resolveApp, getAppConfig } = require('../../helper/paths');
const { assembleFiles } = require('./assembleFiles');

assembleFiles({
  layouts: resolveApp("src/styleguide/templates/**/*.hbs"),
  partials: resolveApp("src/components/**/*.hbs"),
  pages: resolveApp("src/components/**/*.hbs"),
  data: resolveApp("src/components/**/*.json"),
  dest: resolveApp(`${getAppConfig().destPath}/lsg_components`),
  helpers: [
    handlebarsHelpers(),
    resolveApp('helpers/handlebarsHelper/*.js')
  ]
});
