const stylemark = require('stylemark');

const { resolveApp, getAppConfig } = require('../../../helper/paths');

const {destPath, lsgConfigPath} = getAppConfig();

const buildStylemark = (done) => {
  stylemark({
    input: resolveApp(`${destPath}/lsg_components`),
    output: resolveApp(`${destPath}/styleguide`),
    configPath: resolveApp(lsgConfigPath)
  });
  done();
};

module.exports = {
  buildStylemark
}