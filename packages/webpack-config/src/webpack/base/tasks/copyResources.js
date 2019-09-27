import CopyWebpackPlugin from "copy-webpack-plugin";

import { resolveApp, getAppConfig } from "../../../helpers/paths";

const { resourcesHome } = getAppConfig();

export const copyResources = {
  plugins: [
    new CopyWebpackPlugin([
      { from: resolveApp(resourcesHome), to: "resources" }
    ])
  ]
};