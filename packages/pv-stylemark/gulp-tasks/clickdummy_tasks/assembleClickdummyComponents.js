const assemble = require("@pro-vision/assemble-lite");

const { resolveApp, getAppConfig, join } = require("../../helper/paths");

const {destPath, cdTemplatesSrc, componentsSrc, hbsHelperSrc} = getAppConfig();

function *composeDataPaths(...fileExtensions) {
  for (const ext of fileExtensions) {
    yield resolveApp(join(componentsSrc, `**/*.${ext}`));
    yield resolveApp(join(cdTemplatesSrc, `*.${ext}`));
  }
}

const assembleClickdummyComponents = () => assemble({
  baseDir: resolveApp(componentsSrc),
  partials: resolveApp(join(componentsSrc, "**/*.hbs")),
  pages: resolveApp(join(componentsSrc, "**/*.hbs")),
  templates: resolveApp(join(cdTemplatesSrc, "**/*.hbs")),
  data: [...composeDataPaths("json", "yaml", "yml")],
  helpers: resolveApp(join(hbsHelperSrc, "*.js")),
  target: resolveApp(join(destPath, "components"))
});

assembleClickdummyComponents();

module.exports = {
  assembleClickdummyComponents
};