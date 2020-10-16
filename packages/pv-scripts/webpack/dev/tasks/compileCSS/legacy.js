const { HotModuleReplacementPlugin } = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /\.shadow\.scss$/, // exclude shadow css, for them to be included raw
        use: [
          {
            loader: require.resolve("style-loader")
          },
          {
            loader: require.resolve("css-loader")
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              postcssOptions: {
                plugins: [
                  [
                    require.resolve("postcss-preset-env"),
                    {
                      features: {
                        "dir-pseudo-class": { dir: "ltr" }
                      }
                    }
                  ],
                  [require.resolve("cssnano")]
                ]
              }
            }
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },

  plugins: [new HotModuleReplacementPlugin()]
};
