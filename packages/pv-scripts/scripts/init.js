const path = require("path");
const prompts = require("prompts");
const fs = require("fs-extra");

const pvConfigTemplate = require("../helpers/init/templates/pv.config");
const { asyncCopyFile, asyncWriteFile } = require("../helpers/init/io-helpers");
const { getJSExtName } = require("../helpers/buildConfigHelpers");

const questions = [
  {
    type: "text",
    name: "name",
    message: "What is your project-name?",
    initial: "my-app",
    // convert to kebab-case
    format: (value) => value.replace(/\s+/g, "-").toLowerCase(),
  },
  {
    type: "text",
    name: "namespace",
    message: "What is your projects namespace?",
    // convert to kebab-case
    format: (value) => value.replace(/\s+/g, "-").toLowerCase(),
  },
  {
    type: "toggle",
    name: "useTS",
    message: "Do you want to use Typescript?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "useReact",
    message: "Is this a React Project?",
    initial: false,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "useSCSS",
    message: "Do you want to use SCSS for styling?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
];

const orderObjKeys = (obj) => {
  const tmp = {};

  Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => (tmp[key] = obj[key]));

  return tmp;
};

const getConfigFilePath = (filePath) => {
  return path.resolve(__dirname, `../helpers/init/${filePath}`);
};

const createAppFolder = async (appConfig) => {
  return await fs.ensureDir(appConfig.name);
};

const copyBasicFiles = async (appConfig) => {
  // copy .nvmrc file
  await asyncCopyFile(getConfigFilePath("files"), appConfig.name, ".nvmrc");

  // copy basic README
  await asyncCopyFile(getConfigFilePath("files"), appConfig.name, "README.md");

  // copy basic tsconfig, if needed
  if (appConfig.useTS) {
    await asyncCopyFile(
      getConfigFilePath("files"),
      appConfig.name,
      "tsconfig.json"
    );
  }
};

const generatePvConfig = async (appConfig) => {
  const fileContent = pvConfigTemplate(appConfig);
  return await asyncWriteFile(appConfig.name, "pv.config.js", fileContent);
};

const generatePackageJson = async (appConfig) => {
  const pvScriptsPackageJSON = require("../package.json");
  const appPackageJSON = require("../helpers/init/files/base-package.json");
  // add custom app-name
  appPackageJSON.name = appConfig.name;

  // add custom dependencies
  appPackageJSON.devDependencies[
    "@pro-vision/pv-scripts"
  ] = `^${pvScriptsPackageJSON.version}`;

  // order dependencies by name
  appPackageJSON.devDependencies = orderObjKeys(appPackageJSON.devDependencies);
  appPackageJSON.dependencies = orderObjKeys(appPackageJSON.dependencies);

  return await asyncWriteFile(
    appConfig.name,
    "package.json",
    JSON.stringify(appPackageJSON, null, 2)
  );
};

const createEntryFiles = async (appConfig) => {
  const extName = getJSExtName(appConfig);
  await asyncWriteFile(`${appConfig.name}/src`, `index${extName}`, "");
  await asyncWriteFile(`${appConfig.name}/src`, `legacyIndex${extName}`, "");
  if (appConfig.useSCSS) {
    await asyncWriteFile(`${appConfig.name}/src`, "index.scss", "");
  }
};

(async () => {
  let aborted = false;
  const appConfig = await prompts(questions, {
    onCancel() {
      aborted = true;
    },
  });
  if (aborted) return;
  await createAppFolder(appConfig);
  await copyBasicFiles(appConfig);
  await generatePvConfig(appConfig);
  await createEntryFiles(appConfig);
  await generatePackageJson(appConfig);
})();
