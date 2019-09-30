import { publicPath, getAppConfig, join } from "../../../helpers/paths";

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
