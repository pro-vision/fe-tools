import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const compileCSS = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /\.shadow\.scss$/,
        use : [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              config: {
                path: resolve("config/")
              }
            }
          },
          require.resolve('sass-loader')
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
};