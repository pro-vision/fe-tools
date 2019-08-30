const assemble = require('@pro-vision/assemble-lite');

const { resolveApp, getAppConfig } = require('../../../helper/paths');

const {destPath, cdTemplatesHome, componentsHome, cdPagesHome, hbsHelperHome} = getAppConfig();

const assembleClickdummyPages = (done) => {

  assemble({
    baseDir: resolveApp(cdPagesHome),
    partialsGlob: resolveApp(`${componentsHome}**/*.hbs`),
    pagesGlob: resolveApp(`${cdPagesHome}**/*.hbs`),
    templatesGlob: resolveApp(`${cdTemplatesHome}**/*.hbs`),
    dataGlob: resolveApp(`${componentsHome}**/*.json`),
    helpersGlob: resolveApp(`${hbsHelperHome}*.js`),
    target: resolveApp(`${destPath}/pages`)
  }).then(() => {
    done();  
  }); 
};

module.exports = {
  assembleClickdummyPages
};