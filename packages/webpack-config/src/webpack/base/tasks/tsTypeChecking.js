import { appPath, appSrc } from "../../../helpers/paths";

const path = require("path");
const resolve = require("resolve");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");

export const tsTypeChecking = {
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync("typescript", {
        basedir: path.join(appPath, "node_modules")
      }),
      async: false,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      tsconfig: path.join(appPath, "tsconfig.json"),
      eslint: true,
      reportFiles: ["**"],
      watch: appSrc,
      silent: true,
      formatter: typescriptFormatter
    })
  ]
};
