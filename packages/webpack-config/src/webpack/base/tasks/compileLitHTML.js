const path = require("path");

export const compileLitHTML = {
  module: {
    rules: [
      {
        test: /lit-html/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              [
                require.resolve("@babel/preset-env"),
                {
                  targets: {
                    ie: 11,
                  },
                },
              ],
            ],
            plugins: [
              [
                require.resolve("@babel/plugin-proposal-decorators"),
                {
                  legacy: true
                }
              ],
              [
                require.resolve("@babel/plugin-transform-runtime"),
                {
                  corejs: false,
                  regenerator: true,
                  useESModules: false,
                  helpers: false,
                  absoluteRuntime: path.dirname(require.resolve("@babel/runtime/package.json")),
                },
              ],
            ],
          },
        },
      },
    ]
  }
};