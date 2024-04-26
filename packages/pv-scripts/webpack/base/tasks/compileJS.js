const path = require("path");

const { getBuildConfig } = require("../../../helpers/buildConfigHelpers");
const getBrowserslist = require("../getBrowserslist");

const { babelDecorator } = getBuildConfig();
const legacyDecorators = babelDecorator === "legacy";

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
                [
                  require.resolve("@babel/preset-typescript"),
                  {
                    allowDeclareFields: true, // This will be enabled by default in Babel 8
                  },
                ],
              ],
              assumptions: {
                setPublicClassFields: true,
              },
              plugins: [
                [
                  require.resolve("@babel/plugin-proposal-decorators"),
                  {
                    version: babelDecorator,
                  },
                ],
                ...(legacyDecorators
                  ? [
                      [
                        require.resolve("@babel/plugin-transform-typescript"),
                        {
                          allowDeclareFields: true,
                        },
                      ],
                      require.resolve(
                        "@babel/plugin-transform-class-static-block"
                      ),
                      require.resolve(
                        "@babel/plugin-proposal-class-properties"
                      ),
                    ]
                  : []),
                [
                  require.resolve("@babel/plugin-transform-runtime"),
                  {
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
