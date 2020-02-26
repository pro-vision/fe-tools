const path = require("path");

export const moduleCompileES = {
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
                    targets: {
                      esmodules: true
                    }
                  }
                ]
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
                    useESModules: true,
                    helpers: false,
                    absoluteRuntime: path.dirname(
                      require.resolve("@babel/runtime/package.json")
                    )
                  }
                ],
                require.resolve("@babel/plugin-syntax-dynamic-import"),
                [require.resolve("@babel/plugin-proposal-class-properties"), { loose: true }],
                require.resolve("@babel/plugin-proposal-object-rest-spread")
              ]
            }
          }
        ]
      }
    ]
  }
};
