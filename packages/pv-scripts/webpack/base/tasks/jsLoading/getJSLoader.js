const { getBuildConfig } = require("../../../../helpers/buildConfigHelpers");
const compileTS = require("./compileTS");
const compileES = require("./compileES");
const compileJSX = require("./compileJSX");
const compileTSX = require("./compileTSX");

module.exports = () => {
  const { useTS, useReact } = getBuildConfig();

  if (useReact && useTS) return compileTSX;
  else if (useReact) return compileJSX;
  else if (useTS) return compileTS;
  return compileES;
};
