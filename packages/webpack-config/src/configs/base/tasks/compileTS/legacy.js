export const legacyCompileTS = {
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                [require.resolve("@babel/preset-env"), {
                  targets: {
                    esmodules: false
                  }
                }],
                require.resolve("@babel/preset-typescript")
              ],
              plugins: [
                [require.resolve("@babel/plugin-proposal-decorators"), {
                  legacy: true 
                }],
                require.resolve("@babel/plugin-transform-runtime"),
                require.resolve("@babel/plugin-transform-async-to-generator"),
                require.resolve("@babel/plugin-syntax-dynamic-import"),
                require.resolve("@babel/plugin-proposal-class-properties"),
			          require.resolve("@babel/plugin-proposal-object-rest-spread")
              ]
            }
          },
        ]
      },
    ]
  }
};