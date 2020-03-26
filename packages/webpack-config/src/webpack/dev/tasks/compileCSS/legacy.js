import { HotModuleReplacementPlugin } from "webpack";

export const legacyCompileCSS = {
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
            loader: require.resolve("css-loader"),
            options: {
              sourceMap: true,
            }
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              sourceMap: true,
              ident: "postcss",
              plugins: () => [
                require("postcss-preset-env")({
                  features: {
                    "dir-pseudo-class": { dir: "ltr" }
                  }
                }),
                require("cssnano")
              ]
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
