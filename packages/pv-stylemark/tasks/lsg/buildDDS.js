const { buildLsgPage } = require("./buildLsgPage");
const { getLsgData } = require("./getLsgData");
const { buildLsgExamples } = require("./buildLsgExamples");
const { copyUiAssets } = require("./copyUiAssets");
const { getLsgConfig } = require("../../helper/config-helper");
const { resolveApp, getAppConfig, join } = require("../../helper/paths");

const buildDDS = async () => {
  const { componentsSrc } = getAppConfig();
  const config = await getLsgConfig();
  const lsgData = await getLsgData(resolveApp(join(componentsSrc, "**/*.md")), config);
  await buildLsgPage(lsgData, config);
  await buildLsgExamples(lsgData, config);
  await copyUiAssets();
};

module.exports = {
  buildDDS,
};
