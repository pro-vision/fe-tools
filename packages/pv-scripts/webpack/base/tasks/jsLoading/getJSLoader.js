const { getAppConfig } = require("../../../../helpers/paths");
const moduleCompileTS = require("./compileTS/module");
const legacyCompileTS = require("./compileTS/legacy");
const moduleCompileES = require("./compileES/module");
const legacyCompileES = require("./compileES/legacy");
const moduleCompileJSX = require("./compileJSX/module");
const legacyCompileJSX = require("./compileJSX/legacy");
const moduleCompileTSX = require("./compileTSX/module");
const legacyCompileTSX = require("./compileTSX/legacy");

module.exports = type => {
  const { useTS, useReact } = getAppConfig();
  let loaders = [moduleCompileTS, legacyCompileTS];

  if (!useTS) {
    loaders = [moduleCompileES, legacyCompileES];
  } else if (useReact) {
    loaders = [moduleCompileTSX, legacyCompileTSX];
  }

  if (useReact && !useTS) {
    loaders = [moduleCompileJSX, legacyCompileJSX];
  }

  if (type === "module") return loaders[0];

  return loaders[1];
};
