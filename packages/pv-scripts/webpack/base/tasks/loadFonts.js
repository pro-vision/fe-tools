const { publicPath, getAppConfig, join } = require("../../../helpers/paths");

const { fontsSrc } = getAppConfig();

module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|otf|eot|ttf)([?]?.*)$/,
        use: [
          {
            loader: require.resolve("file-loader"),
            options: {
              publicPath: join(publicPath, fontsSrc),
              name: "[name].[ext]",
              outputPath: fontsSrc
            }
          }
        ]
      }
    ]
  }
};
