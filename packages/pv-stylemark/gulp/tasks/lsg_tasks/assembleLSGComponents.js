const assemble = require('@pro-vision/assemble-lite');

const { resolveApp, getAppConfig } = require('../../../helper/paths');

const {destPath, lsgTemplatesHome, componentsHome, hbsHelperHome} = getAppConfig();

const assembleLSGComponents = (done) => {

  assemble({
    baseDir: resolveApp(componentsHome),
    partialsGlob: resolveApp(`${componentsHome}**/*.hbs`),
    pagesGlob: resolveApp(`${componentsHome}**/*.hbs`),
    templatesGlob: resolveApp(`${lsgTemplatesHome}**/*.hbs`),
    dataGlob: resolveApp(`${componentsHome}**/*.json`),
    helpersGlob: resolveApp(`${hbsHelperHome}*.js`),
    target: resolveApp(`${destPath}/lsg_components`)
  }).then(() => {
    done();  
  }); 
};

module.exports = {
  assembleLSGComponents
};