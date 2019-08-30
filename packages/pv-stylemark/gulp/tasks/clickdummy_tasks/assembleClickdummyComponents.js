const assemble = require("@pro-vision/assemble-lite");

const { resolveApp, getAppConfig } = require("../../../helper/paths");

const {destPath, cdTemplatesHome, componentsHome, hbsHelperHome} = getAppConfig();

const assembleClickdummyComponents = done => {

  assemble({
    baseDir: resolveApp(componentsHome),
    partialsGlob: resolveApp(`${componentsHome}**/*.hbs`),
    pagesGlob: resolveApp(`${componentsHome}**/*.hbs`),
    templatesGlob: resolveApp(`${cdTemplatesHome}**/*.hbs`),
    dataGlob: [resolveApp(`${componentsHome}**/*.json`), resolveApp(`${cdTemplatesHome}*.json`)],
    helpersGlob: resolveApp(`${hbsHelperHome}*.js`),
    target: resolveApp(`${destPath}/components`)
  }).then(() => {
    done();
  });
};

module.exports = {
  assembleClickdummyComponents
};