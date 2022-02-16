const prompts = require("prompts");

const { questions } = require("../helpers/init/scripts/questions");
const {
  createAppFolder,
  generatePvConfig,
  generateWebpackConfigs,
  createEntryFiles,
} = require("../helpers/init/scripts/basics");
const copyFiles = require("../helpers/init/scripts/copyFiles");
const generatePackageJson = require("../helpers/init/scripts/generatePackageJson");

(async () => {
  let aborted = false;
  const appConfig = await prompts(questions, {
    onCancel() {
      aborted = true;
    },
  });
  if (aborted) return;
  await createAppFolder(appConfig);
  await copyFiles(appConfig);
  await generatePvConfig(appConfig);
  await generateWebpackConfigs(appConfig);
  await createEntryFiles(appConfig);
  await generatePackageJson(appConfig);
})();
