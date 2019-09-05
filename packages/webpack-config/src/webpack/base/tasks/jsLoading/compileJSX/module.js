export const moduleCompileJSX = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                [
                  require.resolve("@babel/preset-env"),
                  {
                    targets: {
                      esmodules: true
                    }
                  }
                ],
                require.resolve("@babel/preset-react")
              ],
              plugins: [
                require.resolve("@babel/plugin-proposal-class-properties"),
                require.resolve("@babel/plugin-transform-arrow-functions"),
                require.resolve("@babel/plugin-syntax-dynamic-import"),
                require.resolve("@babel/plugin-syntax-import-meta"),
                require.resolve("@babel/plugin-proposal-json-strings"),
                [
                  require.resolve("@babel/plugin-proposal-decorators"),
                  {
                    legacy: true
                  }
                ],
                require.resolve("@babel/plugin-proposal-function-sent"),
                require.resolve("@babel/plugin-proposal-export-namespace-from"),
                require.resolve("@babel/plugin-proposal-numeric-separator"),
                require.resolve("@babel/plugin-proposal-throw-expressions")
              ]
            }
          }
        ]
      }
    ]
  }
};
