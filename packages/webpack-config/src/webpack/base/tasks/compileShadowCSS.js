export const compileShadowCSS = {
  module: {
    rules: [
      {
        test: /\.shadow\.scss$/,
        use: [
          {
            loader: require.resolve('raw-loader'),
          },
          {
            loader: require.resolve('sass-loader')
          },
        ]
      }
    ],
  }
};