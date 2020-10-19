const assemble = require("@pro-vision/assemble-lite");

const { resolveApp, getAppConfig, join } = require("../../helper/paths");

const {
  destPath,
  lsgTemplatesSrc,
  componentsSrc,
  hbsHelperSrc,
} = getAppConfig();

const assembleLSGComponents = () => {
  return assemble({
    baseDir: resolveApp(componentsSrc),
    partials: resolveApp(join(componentsSrc, "**/*.hbs")),
    pages: resolveApp(join(componentsSrc, "**/*.hbs")),
    templates: resolveApp(join(lsgTemplatesSrc, "**/*.hbs")),
    data: [
      resolveApp(join(componentsSrc, "**/*.json")),
      resolveApp(join(componentsSrc, "**/*.yaml")),
      resolveApp(join(componentsSrc, "**/*.yml")),
    ],
    helpers: resolveApp(join(hbsHelperSrc, "*.js")),
    target: resolveApp(join(destPath, "/lsg_components")),
  });
};

assembleLSGComponents();

module.exports = {
  assembleLSGComponents,
};
