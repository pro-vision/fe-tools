const resolve = require("resolve");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");

const { appPath, join } = require("../../../helpers/paths");

module.exports = {
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      typescript: {
        typescriptPath: resolve.sync("typescript", {
          basedir: join(appPath, "node_modules"),
        }),
        context: appPath,
        configFile: join(appPath, "tsconfig.json"),
      },
      formatter: typescriptFormatter,
      logger: {
        infrastructure: "silent",
      },
    }),
  ],
};
