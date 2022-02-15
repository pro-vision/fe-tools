const { appTarget, publicPath } = require("../../../../helpers/paths");
const {
  shouldAddContentHash,
} = require("../../../../helpers/buildConfigHelpers");

module.exports = {
  output: {
    path: appTarget,
    publicPath,
    filename: shouldAddContentHash()
      ? "js/[name].[contenthash].legacy.js"
      : "js/[name].legacy.js",
    chunkFilename: "resources/js/chunks/[name].legacy.[chunkhash].js",
    assetModuleFilename: "resources/legacy/[base]",
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: true,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: false,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: false,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false,
    },
  },
};
