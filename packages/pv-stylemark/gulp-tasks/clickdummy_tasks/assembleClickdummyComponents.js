const assemble = require("@pro-vision/assemble-lite");

const { resolveApp, getAppConfig } = require("../../helper/paths");

const {destPath, cdTemplatesHome, componentsHome, hbsHelperHome} = getAppConfig();


const assembleClickdummyComponents = () => assemble({
  baseDir: resolveApp(componentsHome),
  partials: resolveApp(`${componentsHome}**/*.hbs`),
  pages: resolveApp(`${componentsHome}**/*.hbs`),
  templates: resolveApp(`${cdTemplatesHome}**/*.hbs`),
  data: [resolveApp(`${componentsHome}**/*.json`), resolveApp(`${cdTemplatesHome}*.json`)],
  helpers: resolveApp(`${hbsHelperHome}*.js`),
  target: resolveApp(`${destPath}/components`)
});

assembleClickdummyComponents();

module.exports = {
  assembleClickdummyComponents
};