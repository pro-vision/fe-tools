const { handlebarsLoaderOptions: options } = require("../../../helpers/paths");

module.exports = {
  module: {
    rules: [
      {
        test: /\.hbs/,
        use: [
          {
            loader: require.resolve("handlebars-loader"),
            options
          }
        ]
      }
    ]
  }
};
