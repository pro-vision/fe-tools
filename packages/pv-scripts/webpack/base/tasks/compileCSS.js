const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /\.shadow\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: true,
            }
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  [
                    require.resolve("postcss-preset-env"),
                    {
                      features: {
                        "dir-pseudo-class": { dir: "ltr" },
                      },
                    },
                  ],
                  [
                    require.resolve("cssnano"),
                    {
                      preset: [
                        "default",
                        {
                          // Prevent conversion of colors to smallest representation, to avoid problems
                          // when converting `rgba(255, 255, 255, opacity)` to `hsla(0,0%,100%, opacity)`.
                          // The compressor in AEM strips the `%` from the `0%` saturation value,
                          // resulting in an invalid property value.
                          colormin: false,
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              sourceMap: true
            }
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
  ],
};
