const stylemark = require('stylemark');

const { resolveApp, getAppConfig } = require('../../../helper/paths');

const buildStylemark = (done) => {
  stylemark({
    input: resolveApp(`${getAppConfig().destPath}/lsg_components`),
    output: resolveApp(`${getAppConfig().destPath}/styleguide`),
    configPath: resolveApp('config/config.stylemark.yaml')
  });
  done();
};

module.exports = {
  buildStylemark
}