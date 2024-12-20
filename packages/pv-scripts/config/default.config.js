module.exports = {
  devServerPort: 8616,
  srcPath: "src",
  destPath: "target",
  namespace: "",
  jsEntry: "src/index.ts",
  cssEntry: "src/index.scss",
  useTS: true,
  useReact: false,
  copyStaticFiles: false,
  cleanDest: false,
  enableTypeCheck: true,
  fontsSrc: "resources/fonts/",
  resourcesSrc: "resources",
  autoConsoleClear: false,
  handlebarsLoaderOptions: {},
  enableContentHash: false,
  babelDecorator: "legacy", // babel-plugin-proposal-decorators' `version` property
};
