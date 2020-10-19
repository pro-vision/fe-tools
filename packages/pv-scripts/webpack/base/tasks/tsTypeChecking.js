const resolve = require("resolve");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");

const { appPath, appSrc, join } = require("../../../helpers/paths");

module.exports = {
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync("typescript", {
        basedir: join(appPath, "node_modules"),
      }),
      async: false,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      tsconfig: join(appPath, "tsconfig.json"),
      eslint: true,
      reportFiles: ["**"],
      watch: appSrc,
      silent: true,
      formatter: typescriptFormatter,
    }),
  ],
};
