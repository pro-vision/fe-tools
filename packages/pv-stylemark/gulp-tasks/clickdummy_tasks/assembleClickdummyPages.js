const assemble = require("@pro-vision/assemble-lite");

const { resolveApp, getAppConfig } = require("../../helper/paths");

const {destPath, cdTemplatesHome, componentsHome, cdPagesHome, hbsHelperHome} = getAppConfig();


assemble({
  baseDir: resolveApp(cdPagesHome),
  partials: resolveApp(`${componentsHome}**/*.hbs`),
  pages: resolveApp(`${cdPagesHome}**/*.hbs`),
  templates: resolveApp(`${cdTemplatesHome}**/*.hbs`),
  data: resolveApp(`${componentsHome}**/*.json`),
  helpers: resolveApp(`${hbsHelperHome}*.js`),
  target: resolveApp(`${destPath}/pages`)
});