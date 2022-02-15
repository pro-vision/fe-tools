const path = require("path");

const getBrowserslist = require("../../../getBrowserslist");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                [
                  require.resolve("@babel/preset-env"),
                  {
                    targets: getBrowserslist().legacy,
                  },
                ],
              ],
              plugins: [
                [
                  require.resolve("@babel/plugin-proposal-decorators"),
                  {
                    legacy: true,
                  },
                ],
                [
                  require.resolve("@babel/plugin-transform-runtime"),
                  {
                    corejs: false,
                    regenerator: true,
                    useESModules: false,
                    helpers: false,
                    absoluteRuntime: path.dirname(
                      require.resolve("@babel/runtime/package.json")
                    ),
                  },
                ],
                require.resolve("@babel/plugin-transform-async-to-generator"),
                require.resolve("@babel/plugin-syntax-dynamic-import"),
                require.resolve("@babel/plugin-proposal-object-rest-spread"),
                require.resolve("@babel/plugin-proposal-optional-chaining"),
              ],
            },
          },
        ],
      },
    ],
  },
};
