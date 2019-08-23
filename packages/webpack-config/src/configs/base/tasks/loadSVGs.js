export const loadSVGs = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('svg-inline-loader'),
            options: {
              removeTags: true,
              removingTags: ['title', 'desc'],
            },
          },
        ],
      }
    ],
  }
};