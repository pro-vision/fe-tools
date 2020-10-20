const { publicPath, join } = require("../../../helpers/paths");
const { getBuildConfig } = require("../../../helpers/buildConfigHelpers");

const { fontsSrc } = getBuildConfig();

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
              outputPath: fontsSrc,
            },
          },
        ],
      },
    ],
  },
};
