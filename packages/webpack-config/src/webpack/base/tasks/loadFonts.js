import { publicPath, getAppConfig } from "../../../helpers/paths";

const { join } = require("path");

const { fontsSrc } = getAppConfig();

export const loadFonts = {
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
