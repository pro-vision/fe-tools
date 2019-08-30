const handlebarsHelpers = require("handlebars-helpers");

const { resolveApp, getAppConfig } = require("../../helper/paths");
const { assembleFiles } = require("./assembleFiles");

const {destPath, cdTemplatesHome, componentsHome, hbsHelperHome} = getAppConfig();

assembleFiles({
  layouts: resolveApp(`${cdTemplatesHome}**/*.hbs`),
  partials: resolveApp(`${componentsHome}**/*.hbs`),
  pages: resolveApp(`${componentsHome}**/*.hbs`),
  data: [resolveApp(`${componentsHome}**/*.json`), resolveApp(`${cdTemplatesHome}*.json`)],
  dest: resolveApp(`${destPath}/components`),
  helpers: [
    handlebarsHelpers(),
    resolveApp(`${hbsHelperHome}*.js`),
  ]
});
