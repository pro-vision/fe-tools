const { resolve } = require("path");
const handlebarsHelpers = require("handlebars-helpers");

const { getPaths } = require("./io-helper");


const loadHelpers = async (helpers, hbsInstance) => {

  hbsInstance.registerHelper(handlebarsHelpers());

  const helperPaths = await getPaths(helpers);
  helperPaths.forEach(path => {
    try {
      const helperFn = require(resolve(path));
      hbsInstance.registerHelper(helperFn);
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