import { HotModuleReplacementPlugin } from "webpack";
import ExtractCssChunks from "extract-css-chunks-webpack-plugin";

export const moduleCompileCSS = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /\.shadow\.scss$/, // exclude shadow css, for them to be included raw
        use: [
          {
            loader: ExtractCssChunks.loader
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

  plugins: [
    new ExtractCssChunks({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),
    new HotModuleReplacementPlugin()
  ]
};
