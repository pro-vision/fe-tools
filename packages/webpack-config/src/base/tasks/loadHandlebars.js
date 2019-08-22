export const loadHandlebars = {
  module: {
    rules: [
      {
        test: /\.hbs/,
        use: [{
          loader: require.resolve("handlebars-loader"),
        }]
      }
    ],
  }
};