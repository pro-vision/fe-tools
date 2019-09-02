const assemble = require("@pro-vision/assemble-lite");

const { resolveApp, getAppConfig } = require("../../helper/paths");

const {destPath, lsgTemplatesHome, componentsHome, hbsHelperHome} = getAppConfig();

const assembleLSGComponents = done => {
  assemble({
    baseDir: resolveApp(componentsHome),
    partials: resolveApp(`${componentsHome}**/*.hbs`),
    pages: resolveApp(`${componentsHome}**/*.hbs`),
    templates: resolveApp(`${lsgTemplatesHome}**/*.hbs`),
    data: resolveApp(`${componentsHome}**/*.json`),
    helpers: resolveApp(`${hbsHelperHome}*.js`),
    target: resolveApp(`${destPath}/lsg_components`)
  }).then(() => {
    done();
  });
};

module.exports = {
  assembleLSGComponents
};