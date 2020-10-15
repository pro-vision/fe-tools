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
            loader: require.resolve("css-loader")
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              ident: "postcss",
              plugins: () => {
                return [
                  require("postcss-preset-env")({
                    features: {
                      "dir-pseudo-class": { dir: "ltr" }
                    }
                  }),
                  require("cssnano")
                ];
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
