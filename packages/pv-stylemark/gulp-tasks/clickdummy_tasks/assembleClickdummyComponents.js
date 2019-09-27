const assemble = require("@pro-vision/assemble-lite");
const { join } = require("path");

const { resolveApp, getAppConfig } = require("../../helper/paths");

const {destPath, cdTemplatesSrc, componentsSrc, hbsHelperSrc} = getAppConfig();


const assembleClickdummyComponents = () => assemble({
  baseDir: resolveApp(componentsSrc),
  partials: resolveApp(join(componentsSrc, "**/*.hbs")),
  pages: resolveApp(join(componentsSrc, "**/*.hbs")),
  templates: resolveApp(join(cdTemplatesSrc, "**/*.hbs")),
  data: [resolveApp(join(componentsSrc, "**/*.json")), resolveApp(join(cdTemplatesSrc, "*.json"))],
  helpers: resolveApp(join(hbsHelperSrc, "*.js")),
  target: resolveApp(join(destPath, "components"))
});

assembleClickdummyComponents();

module.exports = {
  assembleClickdummyComponents
};