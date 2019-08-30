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
              ident: "postcss",
              plugins: () => [require("postcss-preset-env"), require("cssnano")]
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
