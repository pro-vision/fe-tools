import { appTarget, publicPath} from "../../../../helpers/paths";

export const moduleOutputSettings = {
  output: {
    path: appTarget,
    publicPath,
    filename: "js/[name].js",
    chunkFilename: "resources/chunks/[name].[hash].js",
  }
};