const path = require("path");

const getBrowserslist = require("../getBrowserslist");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                [
                  require.resolve("@babel/preset-env"),
                  {
                    targets: getBrowserslist().defaults,
                  },
                ],
                require.resolve("@babel/preset-react"),
                require.resolve("@babel/preset-typescript"),
              ],
              assumptions: {
                setPublicClassFields: true,
              },
              plugins: [
                [
                  require.resolve("@babel/plugin-proposal-decorators"),
                  {
                    legacy: true,
                  },
                ],
                require.resolve("@babel/plugin-proposal-class-properties"),
                [
                  require.resolve("@babel/plugin-transform-runtime"),
                  {
                    corejs: false,
                    regenerator: true,
                    useESModules: true,
                    helpers: false,
                    absoluteRuntime: path.dirname(
                      require.resolve("@babel/runtime/package.json")
                    ),
                  },
                ],
                require.resolve("@babel/plugin-proposal-function-sent"),
                require.resolve("@babel/plugin-proposal-throw-expressions"),
              ],
            },
          },
        ],
      },
    ],
  },
};
