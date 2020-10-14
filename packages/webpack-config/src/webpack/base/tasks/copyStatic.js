import CopyWebpackPlugin from "copy-webpack-plugin";

import { resolveApp } from "../../../helpers/paths";

export const copyStatic = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: resolveApp("static"), to: "." }],
    }),
  ],
};
