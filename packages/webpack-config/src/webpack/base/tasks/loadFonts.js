import { publicPath, getAppConfig } from "../../../helpers/paths";

const { fontRoot } = getAppConfig();

export const loadFonts = {
  module: {
    rules: [
      {
        test: /\.(woff|otf|eot|ttf)([?]?.*)$/,
        use: [
          {
            loader: require.resolve("file-loader"),
            options: {
              publicPath: `${publicPath}${fontRoot}`,
              name: "[name].[ext]",
              outputPath: fontRoot
            }
          }
        ]
      }
    ]
  }
};
