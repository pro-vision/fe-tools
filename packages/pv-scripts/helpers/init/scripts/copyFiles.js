const path = require("path");

const { asyncCopyFile } = require("../io-helpers");

const getConfigFilePath = (filePath) => {
  return path.resolve(__dirname, `../${filePath}`);
};

const copyESLintFiles = async (appConfig) => {
  if (appConfig.useESLint === false) return;
  await Promise.all([
    asyncCopyFile(getConfigFilePath("files"), appConfig.name, ".prettierrc.js"),
    asyncCopyFile(getConfigFilePath("files"), appConfig.name, ".eslintrc.js"),
    asyncCopyFile(getConfigFilePath("files"), appConfig.name, ".eslintignore"),
  ]);
};

const copyStylelintFiles = async (appConfig) => {
  if (appConfig.useStylelint === false) return;
  await Promise.all([
    asyncCopyFile(getConfigFilePath("files"), appConfig.name, ".prettierrc.js"),
    asyncCopyFile(getConfigFilePath("files"), appConfig.name, ".stylelintrc"),
    asyncCopyFile(
      getConfigFilePath("files"),
      appConfig.name,
      ".stylelintignore"
    ),
  ]);
};

const copyJestFiles = async (appConfig) => {
  if (appConfig.useJest === false) return;
  await Promise.all([
    asyncCopyFile(getConfigFilePath("files"), appConfig.name, "jest.config.js"),
    asyncCopyFile(
      getConfigFilePath("files/config/jest"),
      `${appConfig.name}/config/jest`,
      "setupFiles.js"
    ),
    asyncCopyFile(
      getConfigFilePath("files/config/jest"),
      `${appConfig.name}/config/jest`,
      "transformJSFiles.js"
    ),
  ]);
};

const copyFiles = async (appConfig) => {
  // copy .nvmrc file
  await asyncCopyFile(getConfigFilePath("files"), appConfig.name, ".nvmrc");

  // copy basic README
  await asyncCopyFile(getConfigFilePath("files"), appConfig.name, "README.md");

  await asyncCopyFile(
    getConfigFilePath("files"),
    appConfig.name,
    ".browserslistrc"
  );

  await asyncCopyFile(
    getConfigFilePath("files/config/mocker-api"),
    `${appConfig.name}/config/mocker-api`,
    "config.js"
  );

  // copy basic tsconfig, if needed
  if (appConfig.useTS) {
    await asyncCopyFile(
      getConfigFilePath("files"),
      appConfig.name,
      "tsconfig.json"
    );
  }

  if (appConfig.useESLint) {
    await copyESLintFiles(appConfig);
  }
  if (appConfig.useStylelint) {
    await copyStylelintFiles(appConfig);
  }
  if (appConfig.useJest) {
    await copyJestFiles(appConfig);
  }
};

module.exports = copyFiles;
