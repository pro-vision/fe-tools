import { appTarget, publicPath } from "../../../../helpers/paths";

export const legacyOutputSettings = {
  output: {
    path: appTarget,
    publicPath,
    filename: "js/[name].legacy.js",
    chunkFilename: "js/chunks/[name].legacy.[hash].js",
  }
};
