const handlebarsHelpers = require('handlebars-helpers');

const { resolveApp, getAppConfig } = require('../../helper/paths');
const { assembleFiles } = require('./assembleFiles');

const {destPath, cdTemplatesHome, componentsHome, cdPagesHome, hbsHelperHome} = getAppConfig();

assembleFiles({
  layouts: resolveApp(`${cdTemplatesHome}**/*.hbs`),
  partials: resolveApp(`${componentsHome}**/*.hbs`),
  pages: resolveApp(`${cdPagesHome}**/*.hbs`),
  data: resolveApp(`${componentsHome}**/*.json`),
  dest: resolveApp(`${destPath}/pages`),
  helpers: [
    handlebarsHelpers(),
    resolveApp(`${hbsHelperHome}*.js`),
  ]
});
