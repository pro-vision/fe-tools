// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const printBuildError = require("react-dev-utils/printBuildError");
const { explore } = require("source-map-explorer");

const { getAppConfig } = require("../helpers/paths");
const formatWebpackMessages = require("../helpers/formatWebpackMessages");
const { prepareWebpackConfig } = require("../helpers/prepareWebpackConfig");

// Create the production build
function webpackBuild(webpackConfig) {
  console.log("Creating a production build...");

  const compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: []
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join("\n\n")));
      }

      // generate the css stats
      if (process.env.PV_WEBPACK_STATS) {
        const destPath = getAppConfig().destPath;
        explore(path.resolve(process.cwd(), destPath, "css/*.css"), {
          output: {
            format: process.env.PV_WEBPACK_STATS,
            filename: path.resolve(
              process.cwd(),
              destPath,
              `report_css.${process.env.PV_WEBPACK_STATS}`
            )
          },
          // ignore column checks which would throw because of generated eol during the build
          // (see https://github.com/danvk/source-map-explorer/issues/179)
          noBorderChecks: true
        }).catch(error => {
          return console.error(error);
        });
      }

      return resolve({
        stats,
        warnings: messages.warnings
      });
    });
  });
}

prepareWebpackConfig("production")
  .then(webpackConfig => {
    return webpackBuild(webpackConfig);
  })
  .then(
    ({ warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow("Compiled with warnings.\n"));
        console.log(warnings.join("\n\n"));
        console.log(
          `\nSearch for the ${chalk.underline(
            chalk.yellow("keywords")
          )} to learn more about each warning.`
        );
      } else {
        console.log(chalk.green("Compiled successfully.\n"));
      }
    },
    err => {
      console.log(chalk.red("Failed to compile.\n"));
      printBuildError(err);

      process.exit(1);
    }
  )
  .catch(err => {
    console.log("sss");

    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
