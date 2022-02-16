module.exports = function (appConfig) {
  return `const { resolve } = require("path");

module.exports = {
  resolve: {
    alias: {
      Config: resolve("src/js/config"),
      Core: resolve("src/js/core"),
      Constants: resolve("src/js/constants/"),
      Abstracts: resolve("src/components/abstract/"),
      Components: resolve("src/components/"),
      Icons: resolve("resources/icons"),
      Helper: resolve("src/js/helper/"),
      Services: resolve("src/js/services"),
      Interfaces: resolve("src/js/interfaces/"),
    },
  },
  ${
    appConfig.useKluntje === false
      ? ""
      : `module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-inline-loader",
            options: {
              removeTags: true,
              removingTags: ["title", "desc"],
            },
          },
        ],
      },
    ],
  },`
  }
};
`;
};
