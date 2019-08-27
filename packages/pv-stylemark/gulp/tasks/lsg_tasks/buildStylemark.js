const stylemark = require('stylemark');

const { resolveApp } = require('../../../helper/paths');

const buildStylemark = (done) => {
  stylemark({
    input: resolveApp('target/lsg_components'),
    output: resolveApp('target/styleguide'),
    configPath: resolveApp('config/config.stylemark.yaml')
  });
  done();
};

module.exports = {
  buildStylemark
}