import { resolve } from 'path';
import { HotModuleReplacementPlugin } from 'webpack';

export const legacyCompileCSS = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /\.shadow\.scss$/, // exclude shadow css, for them to be included raw
        use: [
          {
            loader: require.resolve("style-loader"),
            options: {
              singleton: true, // Necessary for Galen
            }
          },
          {
            loader: require.resolve("css-loader"),
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              config: {
                path: resolve("config/")
              }
            }
          },
          {
            loader: require.resolve("sass-loader"),
            options: {
              sourceMap: true
            }
          },
        ]
      }
    ]
  },

  plugins: [
    new HotModuleReplacementPlugin(),
  ]
};