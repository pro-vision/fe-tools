

const { resolve } = require("path");
const handlebarsHelpers = require("handlebars-helpers");

const { getPaths } = require("./io-helper");


const loadHelpers = async (helpersGlob, hbsInstance) => {

  hbsInstance.registerHelper(handlebarsHelpers());

  const helperPaths = await getPaths(helpersGlob);
  helperPaths.forEach(path => {
    try {
      const helperFkt = require(resolve(path));
      hbsInstance.registerHelper(helperFkt);
    }
    catch(err) {
      throw new Error("Error:", err);
    }
  });
  return;
};

module.exports = {
  loadHelpers
};