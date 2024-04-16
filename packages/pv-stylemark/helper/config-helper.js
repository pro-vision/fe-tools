const { readFile } = require("fs-extra");
const yaml = require("js-yaml");

const { resolveApp, getAppConfig } = require("./paths");

const getLsgConfig = async () => {
  const { lsgConfigPath } = getAppConfig();
  try {
    const rawConfig = await readFile(resolveApp(lsgConfigPath), {
      encoding: "utf-8",
    });
    const config = yaml.load(rawConfig);
    return config ?? {};
  } catch (error) {
    console.warn("Error reading stylemark-config-file:", error);
    return {};
  }
};

module.exports = {
  getLsgConfig,
};
