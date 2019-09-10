import { CleanWebpackPlugin } from "clean-webpack-plugin";

export const cleanDest = {
  plugins: [
    new CleanWebpackPlugin()
  ]
};
