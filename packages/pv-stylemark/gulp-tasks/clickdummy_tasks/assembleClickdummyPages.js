const assemble = require("@pro-vision/assemble-lite");

const { resolveApp, getAppConfig, join } = require("../../helper/paths");

const {destPath, cdTemplatesSrc, componentsSrc, cdPagesSrc, hbsHelperSrc} = getAppConfig();


const assembleClickdummyPages = () => assemble({
  baseDir: resolveApp(cdPagesSrc),
  partials: resolveApp(join(componentsSrc, "**/*.hbs")),
  pages: resolveApp(join(cdPagesSrc, "**/*.hbs")),
  templates: resolveApp(join(cdTemplatesSrc, "**/*.hbs")),
  data: [
    resolveApp(join(componentsSrc, "**/*.json")),
    resolveApp(join(componentsSrc, "**/*.yaml")),
    resolveApp(join(componentsSrc, "**/*.yml"))
  ],
  helpers: resolveApp(join(hbsHelperSrc, "*.js")),
  target: resolveApp(join(destPath, "pages"))
});

assembleClickdummyPages();

module.exports = {
  assembleClickdummyPages
};