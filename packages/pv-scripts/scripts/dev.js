// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

// ====================================================

const chalk = require("chalk");
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const clearConsole = require("react-dev-utils/clearConsole");

const {
  autoConsoleClearEnabled,
  legacyBuildDisabled,
} = require("../helpers/buildConfigHelpers");
const { prepareWebpackConfig } = require("../helpers/prepareWebpackConfig");
const { getCompiler } = require("../helpers/devServerHelpers");
const isInteractive = process.stdout.isTTY && autoConsoleClearEnabled();

prepareWebpackConfig("development").then((webpackConfig) => {
  // Create a webpack compiler that is configured with custom messages.
  const compiler = getCompiler({
    webpackConfig,
    webpack,
  });

  const devServerConfig = legacyBuildDisabled()
    ? webpackConfig.devServer
    : webpackConfig[0].devServer;

  const devServer = new WebpackDevServer(devServerConfig, compiler);

  const devServerUrl = `http${devServerConfig.https ? "s" : ""}://${
    devServerConfig.host
  }:${devServerConfig.port}`;

  // Launch WebpackDevServer.
  devServer.startCallback(() => {
    if (isInteractive) {
      clearConsole();
    }

    console.log(
      chalk.cyan(`Starting the development server: ${devServerUrl}\n`)
    );
  });

  ["SIGINT", "SIGTERM"].forEach((sig) => {
    process.on(sig, () => {
      devServer.stopCallback(() => {
        process.exit();
      });
    });
  });
});
