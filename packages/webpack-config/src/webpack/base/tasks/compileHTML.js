import HtmlWEbpackPlugin from "html-webpack-plugin";
import { hbsEntry, hbsTarget } from "../../../helpers/paths";

export const compileHTML = {
  plugins: [
    new HtmlWEbpackPlugin({
      template: hbsEntry,
      filename: hbsTarget
    })
  ]
};
