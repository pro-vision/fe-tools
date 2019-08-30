import HtmlWebpackPlugin from "html-webpack-plugin";
import { hbsEntry, hbsTarget } from "../../../helpers/paths";

export const compileHTML = {
  plugins: [
    new HtmlWebpackPlugin({
      template: hbsEntry,
      filename: hbsTarget
    })
  ]
};
