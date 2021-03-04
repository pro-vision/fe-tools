const stylemark = require("stylemark");

const { resolveApp, getAppConfig, join } = require("../../helper/paths");

const { destPath, lsgConfigPath } = getAppConfig();

const buildStylemark = (done) => {
  stylemark({
    input: resolveApp(join(destPath, "lsg_components")),
    output: resolveApp(join(destPath, "styleguide")),
    configPath: resolveApp(lsgConfigPath),
  });
  done();
};

module.exports = {
  buildStylemark,
};
