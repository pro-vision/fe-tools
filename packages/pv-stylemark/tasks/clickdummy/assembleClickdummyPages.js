const assemble = require("@pro-vision/assemble-lite");

const { resolveApp, getAppConfig, join } = require("../../helper/paths");

const assembleClickdummyPages = () => {
  const { destPath, cdTemplatesSrc, componentsSrc, cdPagesSrc, hbsHelperSrc } = getAppConfig();

  return assemble({
    baseDir: resolveApp(cdPagesSrc),
    partials: resolveApp(join(componentsSrc, "**/*.hbs")),
    pages: resolveApp(join(cdPagesSrc, "**/*.hbs")),
    templates: resolveApp(join(cdTemplatesSrc, "**/*.hbs")),
    data: [
      resolveApp(join(componentsSrc, "**/*.json")),
      resolveApp(join(componentsSrc, "**/*.yaml")),
      resolveApp(join(componentsSrc, "**/*.yml")),
      resolveApp(join(componentsSrc, "**/*__data.js")),
    ],
    helpers: resolveApp(join(hbsHelperSrc, "*.js")),
    target: resolveApp(join(destPath, "pages")),
  });
};

module.exports = {
  assembleClickdummyPages,
};
