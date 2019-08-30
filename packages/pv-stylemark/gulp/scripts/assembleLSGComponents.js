const handlebarsHelpers = require("handlebars-helpers");

const { resolveApp, getAppConfig } = require("../../helper/paths");
const { assembleFiles } = require("./assembleFiles");

const {destPath, lsgTemplatesHome, componentsHome, hbsHelperHome} = getAppConfig();

assembleFiles({
  layouts: resolveApp(`${lsgTemplatesHome}**/*.hbs`),
  partials: resolveApp(`${componentsHome}**/*.hbs`),
  pages: resolveApp(`${componentsHome}**/*.hbs`),
  data: resolveApp(`${componentsHome}**/*.json`),
  dest: resolveApp(`${destPath}/lsg_components`),
  helpers: [
    handlebarsHelpers(),
    resolveApp(`${hbsHelperHome}*.js`),
  ]
});
