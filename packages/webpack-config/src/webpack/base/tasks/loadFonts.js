export const loadFonts = {
  module: {
    rules: [
      {
        test: /\.(woff|otf|eot|ttf)([\?]?.*)$/,
        use: [{
          loader: require.resolve('file-loader'),
          options: {
            publicPath: '../assets/fonts/',
            name: '[name].[ext]',
            outputPath: 'assets/fonts/'
          }
        }]
      }
    ],
  }
};