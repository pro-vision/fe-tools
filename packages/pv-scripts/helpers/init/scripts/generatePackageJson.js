const fetch = require("node-fetch");

const { asyncWriteFile } = require("../io-helpers");

const orderObjKeys = (obj) => {
  const tmp = {};

  Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => (tmp[key] = obj[key]));

  return tmp;
};

const getPackageInfo = async (packageJsonUrl) => {
  try {
    const response = await fetch(packageJsonUrl);
    const packageJSON = await response.json();
    return {
      name: packageJSON.name,
      version: packageJSON.version,
    };
  } catch (error) {
    console.warn("Could not find package.json", error);
    return undefined;
  }
};

const generatePackageJson = async (appConfig) => {
  const pvScriptsPackageJSON = require("../../../package.json");
  const appPackageJSON = require("../files/base-package.json");
  const optionalDependencies = require("../files/optional-dependencies.json");
  const optionalDevDependencies = require("../files/optional-devDependencies.json");
  const optionalScripts = require("../files/optional-scripts.json");
  // add custom app-name
  appPackageJSON.name = appConfig.name;

  // add custom dependencies
  appPackageJSON.devDependencies[
    "@pro-vision/pv-scripts"
  ] = `^${pvScriptsPackageJSON.version}`;

  if (appConfig.useESLint === true) {
    appPackageJSON.scripts = {
      ...appPackageJSON.scripts,
      ...optionalScripts.eslint,
    };

    appPackageJSON.devDependencies = {
      ...appPackageJSON.devDependencies,
      ...optionalDevDependencies.eslint,
    };
  }

  if (appConfig.useStylelint === true) {
    appPackageJSON.scripts = {
      ...appPackageJSON.scripts,
      ...optionalScripts.stylelint,
    };

    appPackageJSON.devDependencies = {
      ...appPackageJSON.devDependencies,
      ...optionalDevDependencies.stylelint,
    };
  }
  if (appConfig.useJest === true) {
    appPackageJSON.scripts = {
      ...appPackageJSON.scripts,
      ...optionalScripts.jest,
    };

    appPackageJSON.devDependencies = {
      ...appPackageJSON.devDependencies,
      ...optionalDevDependencies.jest,
    };

    appPackageJSON.jest = {
      testEnvironment: "@happy-dom/jest-environment",
    };
  }

  if (appConfig.useKluntje === true) {
    const packageData = await Promise.all([
      getPackageInfo(
        "https://raw.githubusercontent.com/kluntje/kluntje/master/packages/core/package.json"
      ),
      getPackageInfo(
        "https://raw.githubusercontent.com/kluntje/kluntje/master/packages/js-utils/package.json"
      ),
      getPackageInfo(
        "https://raw.githubusercontent.com/kluntje/kluntje/master/packages/polyfills/package.json"
      ),
      getPackageInfo(
        "https://raw.githubusercontent.com/kluntje/kluntje/master/packages/services/package.json"
      ),
    ]);
    packageData
      .filter((data) => data !== undefined)
      .forEach((curPackage) => {
        appPackageJSON.dependencies[curPackage.name] = curPackage.version;
      });

    appPackageJSON.devDependencies = {
      ...appPackageJSON.devDependencies,
      ...optionalDevDependencies.kluntje,
    };
    appPackageJSON.dependencies = {
      ...appPackageJSON.dependencies,
      ...optionalDependencies.kluntje,
    };
  }

  // order dependencies by name
  appPackageJSON.devDependencies = orderObjKeys(appPackageJSON.devDependencies);
  appPackageJSON.dependencies = orderObjKeys(appPackageJSON.dependencies);

  return await asyncWriteFile(
    appConfig.name,
    "package.json",
    JSON.stringify(appPackageJSON, null, 2)
  );
};

module.exports = generatePackageJson;
