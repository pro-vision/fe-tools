const path = require("path");
const browserslist = require("browserslist");

/**
 * get browserslist from the project calling pv-scripts,
 * fallback to default browsers list
 *
 * @export
 * @returns {object}
 */
module.exports = function getBrowserslist() {
  const projectBrowsersList = browserslist.findConfig(path.resolve(".")) || {};

  const defaultBrowsersList = browserslist.findConfig(
    path.resolve(__dirname, "../../config")
  );

  return Object.assign({}, defaultBrowsersList, projectBrowsersList);
};
