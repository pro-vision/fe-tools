import browserslist from "browserslist";

const path = require("path");

/**
 * get browserslist from the project calling pv-scripts,
 * fallback to default browsers list
 *
 * @export
 * @returns {object}
 */
export default function getBrowserslist() {
  const projectBrowsersList = browserslist.findConfig(path.resolve(".")) || {};

  // default browserslist is copied to the same output directory during the build
  const defaultBrowsersList = browserslist.findConfig(path.resolve(__dirname));

  return Object.assign({}, defaultBrowsersList, projectBrowsersList);
}
