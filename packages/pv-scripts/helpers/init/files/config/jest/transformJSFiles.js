const config = {
  babelrc: false,
  presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/typescript"],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-transform-classes", { loose: true }],
    "@babel/plugin-proposal-object-rest-spread",
  ],
};
module.exports = require("babel-jest").createTransformer(config);
