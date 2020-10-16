const {
  getHandlebarsLoaderOptions
} = require("../../../helpers/buildConfigHelpers");

module.exports = {
  module: {
    rules: [
      {
        test: /\.hbs/,
        use: [
          {
            loader: require.resolve("handlebars-loader"),
            options: getHandlebarsLoaderOptions()
          }
        ]
      }
    ]
  }
};
